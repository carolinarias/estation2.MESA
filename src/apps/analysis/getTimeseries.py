# import sys
import os
# from os import sys, path

import datetime
# import json

# from config import es_constants
from database import querydb

# from apps.productmanagement.datasets import Dataset
from apps.productmanagement.products import Product

from lib.python import functions
from lib.python import es_logging as log

logger = log.my_logger(__name__)

# import numpy as np
import numpy.ma as ma

from greenwich import Raster, Geometry

try:
    from osgeo import gdal
    from osgeo import gdal_array
    from osgeo import ogr, osr
    from osgeo import gdalconst
except ImportError:
    import gdal
    import gdal_array
    import ogr
    import osr
    import gdalconst


def getFilesList(productcode, subproductcode, version, mapsetcode, date_format, start_date, end_date):
    #    Generate a list of files (possibly with repetitions) for extracting timeseries
    #    It applies to a single dataset (prod/sprod/version/mapset) and between 2 dates
    #

    # Prepare for results
    list_files = []
    dates_list = []

    # print productcode
    # print subproductcode
    # print version
    # print mapsetcode
    # print date_format
    # print start_date
    # print end_date

    p = Product(product_code=productcode, version=version)
    dataset = p.get_dataset(mapset=mapsetcode, sub_product_code=subproductcode)
    dataset.get_filenames()

    if date_format == 'YYYYMMDD':
        # Loop over dates
        for date in dataset.get_dates():
            if (date >= start_date) and (date <= end_date):
                filedate = date.strftime("%Y%m%d")
                productfilename = functions.set_path_filename(filedate, productcode, subproductcode, mapsetcode, version, '.tif')
                productfilepath = dataset.fullpath + productfilename
                if os.path.isfile(productfilepath):
                    list_files.append(productfilepath)
                    dates_list.append(date)

    if date_format == 'MMDD':
        # Extract MMDD
        mmdd_start = start_date.month*100+start_date.day
        mmdd_end = end_date.month*100+end_date.day

        # Case 1: same year
        if start_date.year == end_date.year:
            for mmdd in dataset.get_mmdd():
                if mmdd_start <= int(mmdd) <= mmdd_end:
                    # mmdd contains the list of existing 'mmdd' - sorted
                    productfilename = functions.set_path_filename(mmdd, productcode, subproductcode, mapsetcode, version, '.tif')
                    productfilepath = dataset.fullpath + productfilename
                    list_files.append(productfilepath)
                    dates_list.append(datetime.date(start_date.year, int(mmdd[:2]), int(mmdd[2:4])))
            # Debug only
            # logger.info(list_files)

        # Case 2: end_year > start_year
        if start_date.year < end_date.year:
            # list_mmdd contains the list of existing 'mmdd' - sorted
            list_mmdd = dataset.get_mmdd()
            # Put all dates from start_mmdd to end of the year
            for mmdd in list_mmdd:
                if int(mmdd) >= mmdd_start:
                    productfilename = functions.set_path_filename(mmdd, productcode, subproductcode, mapsetcode, version, '.tif')
                    productfilepath = dataset.fullpath + productfilename
                    list_files.append(productfilepath)
                    dates_list.append(datetime.date(start_date.year, int(mmdd[:2]), int(mmdd[2:4])))

            # Fill the list with 'full' years
            for n_years in range(end_date.year-start_date.year-1):
                for mmdd in list_mmdd:
                    productfilename = functions.set_path_filename(mmdd, productcode, subproductcode, mapsetcode, version, '.tif')
                    productfilepath = dataset.fullpath + productfilename
                    list_files.append(productfilepath)
                    dates_list.append(datetime.date(start_date.year+1+n_years, int(mmdd[:2]), int(mmdd[2:4])))

            # Put all dates from begin of the year to end_mmdd
            for mmdd in list_mmdd:
                if int(mmdd) <= mmdd_end:
                    # mmdd contains the list of existing 'mmdd' - sorted
                    productfilename = functions.set_path_filename(mmdd, productcode, subproductcode, mapsetcode, version, '.tif')
                    productfilepath = dataset.fullpath + productfilename
                    list_files.append(productfilepath)
                    dates_list.append(datetime.date(end_date.year, int(mmdd[:2]), int(mmdd[2:4])))

            logger.info(list_files)

    return [list_files, dates_list]


def getTimeseries(productcode, subproductcode, version, mapsetcode, wkt, start_date, end_date):
    #    Extract timeseries from a list of files and return as JSON object
    #    It applies to a single dataset (prod/sprod/version/mapset) and between 2 dates
    ogr.UseExceptions()
    theGeomWkt = ' '.join(wkt.strip().split())
    geom = Geometry(wkt=str(theGeomWkt), srs=4326)

    # Get Product Info
    product_info = querydb.get_product_out_info(productcode=productcode,
                                                subproductcode=subproductcode,
                                                version=version)
    if product_info.__len__() > 0:
        scale_factor = 0
        scale_offset = 0
        nodata = 0
        date_format = ''
        for row in product_info:
            scale_factor = row.scale_factor
            scale_offset = row.scale_offset
            nodata = row.nodata
            unit = row.unit
            date_format = row.date_format

        [list_files, dates_list] = getFilesList(productcode, subproductcode, version, mapsetcode, date_format, start_date, end_date)

        # Built a dictionary with filesnames/dates
        dates_to_files_dict = dict(zip(dates_list, list_files))

        # Generate unique list of files
        unique_list = set(list_files)
        uniqueFilesValues = []

        for infile in unique_list:
            if os.path.isfile(infile):
                try:
                    mx = []
                    single_result = {'filename': '', 'meanvalue_noscaling': nodata, 'meanvalue': nodata}
                    with Raster(infile) as img:
                        # Assign nodata from prod_info
                        img._nodata = nodata
                        with img.clip(geom) as clipped:
                            # Save clipped image (for debug only)
                            # clipped.save(dataset.fullpath+'clipped_'+productfilename)
                            mx = clipped.array()

                    nodata_array_masked = ma.masked_equal(mx, nodata)
                    merged_mask = ma.mask_or(ma.getmask(mx), ma.getmask(nodata_array_masked))
                    mxnodata = ma.masked_array(ma.getdata(mx), merged_mask)

                    if mxnodata.count() == 0:
                        meanResult = 0.0
                    else:
                        meanResult = mxnodata.mean()

                    single_result['filename'] = infile
                    single_result['meanvalue_noscaling'] = meanResult
                    # Scale to physical value
                    finalvalue = (meanResult*scale_factor+scale_offset)
                    single_result['meanvalue'] = finalvalue

                    uniqueFilesValues.append(single_result)

                except Exception, e:
                    logger.debug('ERROR: clipping - %s' % (e))
                    # sys.exit (1)
            else:
                logger.debug('ERROR: raster file does not exist - %s' % infile)
                # sys.exit (1)

        # Define a dictionary to associate filenames/values
        files_to_values_dict = dict((x['filename'], x['meanvalue']) for x in uniqueFilesValues)

        # Prepare array for result
        resultDatesValues = []

        # Returns a list of 'filenames', 'dates', 'values'
        for mydate in dates_list:
            # my_result = {'date': datetime.date.today(), 'filename':'', 'meanvalue':nodata}
            my_result = {'date': datetime.date.today(), 'meanvalue':nodata}

            # Assign the date
            my_result['date'] = mydate
            # Assign the filename
            my_filename = dates_to_files_dict[mydate]
            # my_result['filename'] = my_filename
            # Map from array of Values
            my_result['meanvalue'] = files_to_values_dict[my_filename]

            # Map from array of dates
            resultDatesValues.append(my_result)

        return resultDatesValues
    else:
        logger.debug('ERROR: product not registered in the products table! - %s %s %s' % (productcode, subproductcode, version))
        return []

