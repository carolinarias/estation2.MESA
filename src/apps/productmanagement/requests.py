# -*- coding: utf-8 -*-
#
# purpose: handle request for completing datasets
# author:  MC, JvK
# date:  27.08.2015

import os
import glob
import tarfile
import shutil
import tempfile

# from config import es_constants
# from lib.python import es_logging as log
<<<<<<< HEAD
from lib.python import functions
# from lib.python import metadata
from database import querydb
=======
# from lib.python import functions
# from lib.python import metadata
# from database import querydb
>>>>>>> ca42728ebaf80ee0b698276544d89f72a5ef9992
#
# from .exceptions import (NoProductFound, MissingMapset)
# from .datasets import Dataset
# from .mapsets import Mapset
from apps.productmanagement.products import *

logger = log.my_logger(__name__)

def create_request(productcode, version, mapsetcode=None, subproductcode=None):

    product = Product(product_code=productcode, version=version)

    # Define the 'request' object
    request = {'product': productcode,
<<<<<<< HEAD
               'version': version}

    # Check the level of the request
    if mapsetcode is None:
        if subproductcode is not None:
            logger.error('If mapset is not defined, subproduct cannot be defined !')
            return 1
        else:
            # Get list of all ACTIVE ingested/derived subproducts and associated mapsets
            product_mapsets_subproducts = querydb.get_enabled_ingest_derived_of_product(productcode=productcode, version=version)
            if product_mapsets_subproducts.__len__() > 0:
                request['productmapsets'] = []
                mapset_dict = {}
                dataset_dict = {}
                mapsetcode = ''
                for row in product_mapsets_subproducts:
                    row_dict = functions.row2dict(row)
                    if row_dict['mapsetcode'] != mapsetcode:
                        if mapsetcode != '':
                            request['productmapsets'].append(mapset_dict)
                        mapsetcode = row_dict['mapsetcode']
                        mapset_dict = {'mapsetcode': mapsetcode, 'mapsetdatasets': []}
                        dataset_dict = {}

                    dataset_dict['subproductcode'] = row_dict['subproductcode']
                    dataset_dict['product_type'] = row_dict['product_type']
                    mapset_dict['mapsetdatasets'].append(dataset_dict)
                    dataset_dict = {}
                request['productmapsets'].append(mapset_dict)
                return request
=======
               'version': version,}

    #   Check the level of the request
    if mapsetcode is None:
        if subproductcode is not None:
            logger.error('If mapset in not defined, subproduct cannot be defined !')
            return 1
        else:
            # Get list of all ACTIVE ingested/derived subproducts and associated mapsets
            pass

>>>>>>> ca42728ebaf80ee0b698276544d89f72a5ef9992
    # Mapset is defined
    else:
        if subproductcode is None:
            # Get full list of subproducts (ingest/derived) for the given mapset
            pass
        else:
            # All variable defined -> get missing object
<<<<<<< HEAD
            missing = product.get_missing_datasets(mapset=mapsetcode, sub_product_code=subproductcode, from_date=None, to_date=None)
=======
            missing = product.get_missing_datasets(mapset=mapsetcode,sub_product_code=subproductcode, from_date=None, to_date=None)
>>>>>>> ca42728ebaf80ee0b698276544d89f72a5ef9992

    # Dump the request object to JSON


def handle_request():
    pass