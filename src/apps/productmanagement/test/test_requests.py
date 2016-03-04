# -*- coding: utf-8 -*-

#
#    purpose: Test products functions
#    author:  Jur van 't Klooster
#    date:     27.10.2015
#

from __future__ import absolute_import

import unittest
import json
import pprint

from apps.productmanagement import requests
from apps.productmanagement import products

from config import es_constants
# from lib.python import functions
# from database import connectdb
# from database import querydb
from lib.python import es_logging as log
logger = log.my_logger(__name__)

req_dir=es_constants.es2globals['requests_dir']

class TestRequests(unittest.TestCase):

    def test_requests_1(self):

        test_json_dump = req_dir+'dump_my_json_1.req'
        mapsetcode = None
        subproductcode = None
        # productcode = 'vgt-ndvi'
        # version = 'sv2-pv2.1'
        # # version = 'spot-v1'
        # mapsetcode = 'SPOTV-Africa-1km'
        # subproductcode = 'ndv'

        productcode = 'lsasaf-lst'
        version = 'undefined'
        # version = 'spot-v1'
        # mapsetcode = 'SPOTV-CEMAC-1km'

        request = requests.create_request(productcode, version, mapsetcode=mapsetcode, subproductcode=subproductcode)
        request_json = json.dumps(request,
                               ensure_ascii=False,
                               sort_keys=True,
                               indent=4,
                               separators=(', ', ': '))

        with open(test_json_dump,'w+') as f:
            f.write(request_json)
        f.close()

        print test_json_dump

    def test_requests_2(self):

        req_dir=es_constants.es2globals['requests_dir']
        test_json_dump=req_dir+'/dump_my_json_2.req'
        productcode = 'vgt-ndvi'
        version = 'sv2-pv2.1'
        version = 'spot-v2'
        mapsetcode = 'SPOTV-Africa-1km'
        subproductcode = None
        request = requests.create_request(productcode, version, mapsetcode=mapsetcode, subproductcode=subproductcode)
        request_json = json.dumps(request,
                               ensure_ascii=False,
                               sort_keys=True,
                               indent=4,
                               separators=(', ', ': '))

        with open(test_json_dump,'w+') as f:
            f.write(request_json)
        f.close()

        print request_json

    def test_requests_3(self):

        req_dir=es_constants.es2globals['requests_dir']
        test_json_dump=req_dir+'/dump_my_json_2.req'
        productcode = 'lsasaf-lst'
        version = 'lst'
        version = 'undefined'
        mapsetcode = None
        subproductcode = None
        request = requests.create_request(productcode, version, mapsetcode=mapsetcode, subproductcode=subproductcode)
        request_json = json.dumps(request,
                               ensure_ascii=False,
                               sort_keys=True,
                               indent=4,
                               separators=(', ', ': '))

        with open(test_json_dump,'w+') as f:
            f.write(request_json)
        f.close()

        print request_json

    def test_achive_creation_1(self):

        # Read the request - type c.
        file_req='/eStation2/requests/vgt-fapar_V1.4_SPOTV-ECOWAS-1km_fapar_2016-02-23 1458.req'
        requests.create_archive_from_request(file_req)
        return
        # Read the request - type b.
        file_req='/eStation2/requests/vgt-ndvi_sv2-pv2.1_SPOTV-Africa-1km_all_enabled_datasets_2016-02-23 1457.req'
        requests.create_archive_from_request(file_req)
        return

        # Read the request - type a.
        file_req='/eStation2/requests/vgt-fapar_V1.4_all_enabled_mapsets_2016-02-23 1457.req'
        requests.create_archive_from_request(file_req)

