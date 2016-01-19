ALTER TABLE analysis.timeseries_drawproperties
  ADD COLUMN testupdating character varying;
COMMENT ON COLUMN analysis.timeseries_drawproperties.testupdating IS 'TESTING UPDATING OF JRC DATA';

ALTER TABLE products.thema
  ADD COLUMN testupdating character varying;

  

CREATE OR REPLACE FUNCTION products.test_updating_the_db(full_copy boolean default FALSE)
  RETURNS SETOF text AS
$BODY$
DECLARE 
	_full_copy 			ALIAS FOR  $1;
BEGIN
	-- full_copy := FALSE;

	RETURN QUERY SELECT 'SELECT products.update_insert_product_category('
		|| 'category_id := ''' || category_id || ''''
		|| ', order_index := ' || order_index 
		|| ', descriptive_name := ' || COALESCE('''' || descriptive_name || '''', 'NULL') 
		|| ' );'  as inserts	   
	FROM products.product_category;


	RETURN QUERY SELECT 'SELECT products.update_insert_frequency('
		|| 'frequency_id := ''' || frequency_id || ''''
		|| ', time_unit := ''' || time_unit || ''''	
		|| ', frequency := ' || frequency 
		|| ', frequency_type := ' || COALESCE('''' || frequency_type || '''', 'NULL')
		|| ', description := ' || COALESCE('''' || description || '''', 'NULL')	
		|| ' );'  as inserts	   
	FROM products.frequency;


	RETURN QUERY SELECT 'SELECT products.update_insert_date_format('
		|| 'date_format := ''' || date_format || ''''
		|| ', definition := ' || COALESCE('''' || definition || '''', 'NULL')	
		|| ' );'  as inserts	   
	FROM products.date_format;


	RETURN QUERY SELECT 'SELECT products.update_insert_data_type('
		|| 'data_type_id := ''' || data_type_id || ''''
		|| ', description := ' || COALESCE('''' || description || '''', 'NULL')	
		|| ' );'  as inserts	   
	FROM products.data_type;


	RETURN QUERY SELECT 'SELECT products.update_insert_mapset('
		|| 'mapsetcode := ''' || mapsetcode || ''''
		|| ', defined_by := ''' || defined_by || ''''	
		|| ', descriptive_name := ' || COALESCE('''' || descriptive_name || '''', 'NULL')
		|| ', description := ' || COALESCE('''' || description || '''', 'NULL')	
		|| ', srs_wkt := ' || COALESCE('''' || srs_wkt || '''', 'NULL')		
		|| ', upper_left_long := ' || upper_left_long 	
		|| ', pixel_shift_long := ' || pixel_shift_long 	
		|| ', rotation_factor_long := ' || rotation_factor_long 	
		|| ', upper_left_lat := ' || upper_left_lat 	
		|| ', pixel_shift_lat := ' || pixel_shift_lat 	
		|| ', rotation_factor_lat := ' || rotation_factor_lat 	
		|| ', pixel_size_x := ' || pixel_size_x 	
		|| ', pixel_size_y:= ' || pixel_size_y 	
		|| ', footprint_image := ''' || COALESCE(footprint_image, 'NULL') || ''''	
		|| ', full_copy := ' || _full_copy		
		|| ' );'  as inserts	   
	FROM products.mapset
	WHERE defined_by = 'JRC';


	RETURN QUERY SELECT 'SELECT products.update_insert_thema('
		|| 'thema_id := ''' || thema_id || ''''
		|| ', description := ' || COALESCE('''' || description || '''', 'NULL')	
		|| ' );'  as inserts	   
	FROM products.thema;


	  
	RETURN QUERY SELECT 'SELECT products.update_insert_product('
		|| '  productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', defined_by := ' || COALESCE('''' || defined_by || '''', 'NULL')
		|| ', activated := ' || activated	
		|| ', category_id := ' || COALESCE('''' || category_id || '''', 'NULL')	
		|| ', product_type := ' || COALESCE('''' || product_type || '''', 'NULL')
		|| ', descriptive_name := ' || COALESCE('''' || replace(descriptive_name, '''', '"') || '''', 'NULL')	
		|| ', description := ' || COALESCE('''' || replace(description, '''', '"') || '''', 'NULL')	
		|| ', provider := ' || COALESCE('''' || provider || '''', 'NULL')	
		|| ', frequency_id := ' || COALESCE('''' || frequency_id || '''', '''undefined''')
		|| ', date_format := ' || COALESCE('''' || date_format || '''', '''undefined''')
		|| ', scale_factor := ' || COALESCE(TRIM(to_char(scale_factor, '99999999D999999')), 'NULL')
		|| ', scale_offset := ' || COALESCE(TRIM(to_char(scale_offset, '99999999D999999')), 'NULL')
		|| ', nodata := ' || COALESCE(TRIM(to_char(nodata, '99999999')), 'NULL')
		|| ', mask_min := ' || COALESCE(TRIM(to_char(mask_min, '99999999D999999')), 'NULL')
		|| ', mask_max := ' || COALESCE(TRIM(to_char(mask_max, '99999999D999999')), 'NULL')	
		|| ', unit := ' || COALESCE('''' || unit || '''', 'NULL')
		|| ', data_type_id := ' || COALESCE('''' || data_type_id || '''', '''undefined''')
		|| ', masked := ' || masked
		|| ', timeseries_role := ' || COALESCE('''' || timeseries_role || '''', 'NULL')		
		|| ', full_copy := ' || _full_copy				
		|| ' );'  as inserts	   
	FROM products.product
	WHERE defined_by = 'JRC';


	  
	RETURN QUERY SELECT 'SELECT products.update_insert_thema_product('
		|| 'thema_id := ''' || thema_id || ''''
		|| ', productcode := ''' || productcode || ''''	
		|| ', version := ''' || version || ''''	
		|| ', mapsetcode := ''' || mapsetcode || ''''	
		|| ', activated := ' || activated 	
		|| ' );'  as inserts	   
	FROM products.thema_product;


	  
	-- insert into products.datasource_description (datasource_descr_id) select internet_id from products.internet_source where internet_id not in (select datasource_descr_id from products.datasource_description)

	RETURN QUERY SELECT 'SELECT products.update_insert_internet_source('
		|| 'internet_id := ''' || internet_id || ''''
		|| ', defined_by := ''' || defined_by || ''''	
		|| ', descriptive_name := ' || COALESCE('''' || descriptive_name || '''', 'NULL')	
		|| ', description := ' || COALESCE('''' || description || '''', 'NULL')	
		|| ', modified_by := ' || COALESCE('''' || modified_by || '''', 'NULL')			
		|| ', update_datetime := ''' || COALESCE(update_datetime, now()) || ''''			
		|| ', url := ' || COALESCE('''' || url || '''', 'NULL')	
		|| ', user_name := ' || COALESCE('''' || user_name || '''', 'NULL')	
		|| ', password := ' || COALESCE('''' || password || '''', 'NULL')	
		|| ', type := ' || COALESCE('''' || type || '''', 'NULL')	
		|| ', include_files_expression := ' || COALESCE('''' || include_files_expression || '''', 'NULL')	
		|| ', files_filter_expression := ' || COALESCE('''' || files_filter_expression || '''', 'NULL')		
		|| ', status := ' || status 		
		|| ', pull_frequency:= ' || pull_frequency 	
		|| ', datasource_descr_id := ' || COALESCE('''' || internet_id || '''', 'NULL')		
		|| ', frequency_id := ' || COALESCE('''' || frequency_id || '''', '''undefined''') 					
		|| ', start_date:=   ' || COALESCE(TRIM(to_char(start_date, '999999999999')), 'NULL')	  
		|| ', end_date:= ' || COALESCE(TRIM(to_char(end_date, '999999999999')), 'NULL')
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts	   
	FROM products.internet_source
	WHERE defined_by = 'JRC';


	-- insert into products.datasource_description (datasource_descr_id) select eumetcast_id from products.eumetcast_source where eumetcast_id not in (select datasource_descr_id from products.datasource_description)

	RETURN QUERY SELECT 'SELECT products.update_insert_eumetcast_source('
		|| '  eumetcast_id := ' || COALESCE('''' || eumetcast_id || '''', 'NULL')
		|| ', filter_expression_jrc := ' || COALESCE('''' || filter_expression_jrc || '''', 'NULL')
		|| ', collection_name := ' || COALESCE('''' || collection_name || '''', 'NULL')
		|| ', status := ' || status	
		|| ', internal_identifier := ' || COALESCE('''' || internal_identifier || '''', 'NULL')	
		|| ', collection_reference := ' || COALESCE('''' || collection_reference || '''', 'NULL')	
		|| ', acronym := ' || COALESCE('''' || acronym || '''', 'NULL')
		|| ', description := ' || COALESCE('''' || replace(description, '''', '"') || '''', 'NULL')	
		|| ', product_status := ' || COALESCE('''' || product_status || '''', 'NULL')
		|| ', date_creation := ' || COALESCE('''' || to_char(date_creation, 'YYYY-MM-DD') || '''', 'NULL') 	
		|| ', date_revision := ' || COALESCE('''' || to_char(date_revision, 'YYYY-MM-DD') || '''', 'NULL') 		
		|| ', date_publication := ' || COALESCE('''' || to_char(date_publication, 'YYYY-MM-DD') || '''', 'NULL') 	
		|| ', west_bound_longitude := ' || COALESCE(TRIM(to_char(west_bound_longitude, '99999999D999999')), 'NULL')
		|| ', east_bound_longitude := ' || COALESCE(TRIM(to_char(east_bound_longitude, '99999999D999999')), 'NULL')
		|| ', north_bound_latitude := ' || COALESCE(TRIM(to_char(north_bound_latitude, '99999999D999999')), 'NULL')
		|| ', south_bound_latitude := ' || COALESCE(TRIM(to_char(south_bound_latitude, '99999999D999999')), 'NULL')
		|| ', provider_short_name := ' || COALESCE('''' || provider_short_name || '''', 'NULL')
		|| ', collection_type := ' || COALESCE('''' || collection_type || '''', 'NULL')
		|| ', keywords_distribution := ' || COALESCE('''' || keywords_distribution || '''', 'NULL')	
		|| ', keywords_theme := ' || COALESCE('''' || keywords_theme || '''', 'NULL')
		|| ', keywords_societal_benefit_area := ' || COALESCE('''' || keywords_societal_benefit_area || '''', 'NULL')
		|| ', orbit_type := ' || COALESCE('''' || orbit_type || '''', 'NULL')
		|| ', satellite := ' || COALESCE('''' || satellite || '''', 'NULL')
		|| ', satellite_description := ' || COALESCE('''' || satellite_description || '''', 'NULL')	
		|| ', instrument := ' || COALESCE('''' || instrument || '''', 'NULL')
		|| ', spatial_coverage := ' || COALESCE('''' || spatial_coverage || '''', 'NULL')
		|| ', thumbnails := ' || COALESCE('''' || thumbnails || '''', 'NULL')
		|| ', online_resources := ' || COALESCE('''' || replace(online_resources, '''', '"') || '''', 'NULL')
		|| ', distribution := ' || COALESCE('''' || distribution || '''', 'NULL')
		|| ', channels := ' || COALESCE('''' || channels || '''', 'NULL')
		|| ', data_access := ' || COALESCE('''' || replace(data_access, '''', '"') || '''', 'NULL')
		|| ', available_format := ' || COALESCE('''' || available_format || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', typical_file_name := ' || COALESCE('''' || typical_file_name || '''', 'NULL')
		|| ', average_file_size := ' || COALESCE('''' || average_file_size || '''', 'NULL')
		|| ', frequency := ' || COALESCE('''' || frequency || '''', 'NULL')
		|| ', legal_constraints_access_constraint := ' || COALESCE('''' || legal_constraints_access_constraint || '''', 'NULL')
		|| ', legal_use_constraint := ' || COALESCE('''' || legal_use_constraint || '''', 'NULL')
		|| ', legal_constraints_data_policy := ' || COALESCE('''' || legal_constraints_data_policy || '''', 'NULL')	
		|| ', entry_date := ' || COALESCE('''' || to_char(entry_date, 'YYYY-MM-DD') || '''', 'NULL')
		|| ', reference_file := ' || COALESCE('''' || reference_file || '''', 'NULL')
		|| ', datasource_descr_id := ' || COALESCE('''' || eumetcast_id || '''', 'NULL')	
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts	   
	FROM products.eumetcast_source;

	  
	  
	RETURN QUERY SELECT 'SELECT products.update_insert_datasource_description('
		|| '  datasource_descr_id := ' || COALESCE('''' || datasource_descr_id || '''', 'NULL')
		|| ', format_type := ' || COALESCE('''' || format_type || '''', 'NULL')
		|| ', file_extension := ' || COALESCE('''' || file_extension || '''', 'NULL')
		|| ', delimiter := ' || COALESCE('''' || delimiter || '''', 'NULL')
		|| ', date_format := ' || COALESCE('''' || date_format || '''', '''undefined''') 
		|| ', date_position := ' || COALESCE('''' || date_position || '''', 'NULL')	
		|| ', product_identifier := ' || COALESCE('''' || product_identifier || '''', 'NULL')
		|| ', prod_id_position := ' || COALESCE(TRIM(to_char(prod_id_position, '99999999')), 'NULL')
		|| ', prod_id_length := ' || COALESCE(TRIM(to_char(prod_id_length, '99999999')), 'NULL')
		|| ', area_type := ' || COALESCE('''' || area_type || '''', 'NULL')	
		|| ', area_position := ' || COALESCE('''' || area_position || '''', 'NULL')
		|| ', area_length := ' || COALESCE(TRIM(to_char(area_length, '99999999')), 'NULL')
		|| ', preproc_type := ' || COALESCE('''' || preproc_type || '''', 'NULL')	
		|| ', product_release := ' || COALESCE('''' || product_release || '''', 'NULL')
		|| ', release_position := ' || COALESCE('''' || release_position || '''', 'NULL')
		|| ', release_length := ' || COALESCE(TRIM(to_char(release_length, '99999999')), 'NULL')
		|| ', native_mapset := ' || COALESCE('''' || native_mapset || '''', 'NULL')	
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts		   
	FROM products.datasource_description dd 
	WHERE dd.datasource_descr_id in (SELECT eumetcast_id FROM products.eumetcast_source)
	  OR dd.datasource_descr_id in (SELECT internet_id FROM products.internet_source WHERE defined_by = 'JRC');



	RETURN QUERY SELECT 'SELECT products.update_insert_product_acquisition_data_source('
		|| ' productcode := ''' || productcode || ''''	
		|| ', subproductcode := ''' || subproductcode || ''''		
		|| ', version := ''' || version || ''''	
		|| ', data_source_id := ''' || data_source_id || ''''	
		|| ', defined_by := ''' || defined_by || ''''	
		|| ', type := ''' || type || ''''		
		|| ', activated := ' || activated 	
		|| ', store_original_data := ' || store_original_data 	
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts		   
	FROM products.product_acquisition_data_source
	WHERE defined_by = 'JRC';



	RETURN QUERY SELECT 'SELECT products.update_insert_sub_datasource_description('
		|| '  productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', datasource_descr_id := ' || COALESCE('''' || datasource_descr_id || '''', 'NULL')
		|| ', scale_factor := ' || COALESCE(TRIM(to_char(scale_factor, '99999999D999999')), 'NULL')
		|| ', scale_offset := ' || COALESCE(TRIM(to_char(scale_offset, '99999999D999999')), 'NULL')
		|| ', no_data := ' || COALESCE(TRIM(to_char(no_data, '99999999D999999')), 'NULL')
		|| ', data_type_id := ' || COALESCE('''' || data_type_id || '''', '''undefined''')	
		|| ', mask_min := ' || COALESCE(TRIM(to_char(mask_min, '99999999D999999')), 'NULL')
		|| ', mask_max := ' || COALESCE(TRIM(to_char(mask_max, '99999999D999999')), 'NULL')	
		|| ', re_process := ' || COALESCE('''' || re_process || '''', 'NULL')
		|| ', re_extract := ' || COALESCE('''' || re_extract || '''', 'NULL')		
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts		   
	FROM products.sub_datasource_description;



	RETURN QUERY SELECT 'SELECT products.update_insert_ingestion('
		|| '  productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', mapsetcode := ' || COALESCE('''' || mapsetcode || '''', 'NULL')
		|| ', defined_by := ' || COALESCE('''' || defined_by || '''', 'NULL')
		|| ', activated := ' || activated 	
		|| ', wait_for_all_files := ' || wait_for_all_files 		
		|| ', input_to_process_re := ' || COALESCE('''' || input_to_process_re || '''', 'NULL')
		|| ', enabled := ' || enabled 		
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts	   
	FROM products.ingestion
	WHERE defined_by = 'JRC';



	RETURN QUERY SELECT 'SELECT products.update_insert_processing('
		|| ' process_id := ' || process_id
		|| ', defined_by := ' || COALESCE('''' || defined_by || '''', 'NULL')
		|| ', output_mapsetcode := ' || COALESCE('''' || output_mapsetcode || '''', 'NULL')
		|| ', activated := ' || activated 	
		|| ', derivation_method := ' || COALESCE('''' || derivation_method || '''', 'NULL')
		|| ', algorithm := ' || COALESCE('''' || algorithm || '''', 'NULL')
		|| ', priority := ' || COALESCE('''' || priority || '''', 'NULL')
		|| ', enabled := ' || enabled 	
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts	   
	FROM products.processing
	WHERE defined_by = 'JRC';



	RETURN QUERY SELECT 'SELECT products.update_insert_process_product('
		|| ' process_id := ' || process_id
		|| ', productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', mapsetcode := ' || COALESCE('''' || mapsetcode || '''', 'NULL')
		|| ', type := ' || COALESCE('''' || type || '''', 'NULL')
		|| ', activated := ' || activated 	
		|| ', final := ' || final 		
		|| ', date_format := ' || COALESCE('''' || date_format || '''', '''undefined''')
		|| ', start_date:=   ' || COALESCE(TRIM(to_char(start_date, '999999999999')), 'NULL')	  
		|| ', end_date:= ' || COALESCE(TRIM(to_char(end_date, '999999999999')), 'NULL')	
		|| ', full_copy := ' || _full_copy						
		|| ' );'  as inserts	   
	FROM products.process_product
	WHERE process_id IN (SELECT process_id FROM products.processing WHERE defined_by = 'JRC');

	
	RETURN QUERY SELECT 'SELECT analysis.update_insert_i18n('
		|| ' label := ' || COALESCE('''' || label || '''', 'NULL') 
		|| ', eng := ''' || COALESCE(replace(eng, '''', '"'), 'NULL') || ''''
		|| ', fra := ''' || COALESCE(replace(fra, '''', '"'), 'NULL') || ''''
		|| ', por := ''' || COALESCE(replace(por, '''', '"'), 'NULL') || ''''
		|| ', lang1 := ''' || COALESCE(replace(lang1, '''', '"'), 'NULL') || ''''
		|| ', lang2 := ''' || COALESCE(replace(lang2, '''', '"'), 'NULL') || ''''
		|| ', lang3 := ''' || COALESCE(replace(lang3, '''', '"'), 'NULL') || ''''
		|| ' );'  as inserts	   
	FROM analysis.i18n;


	RETURN QUERY SELECT 'SELECT analysis.update_insert_languages('
		|| ' langcode := ' || COALESCE('''' || langcode || '''', 'NULL')
		|| ', langdescription := ' || COALESCE('''' || langdescription || '''', 'NULL')
		|| ', active := ' || active 	
		|| ' );'  as inserts	   
	FROM analysis.languages;
	

														  
	RETURN QUERY SELECT 'SELECT analysis.update_insert_legend('
		|| ' legend_id := ' || legend_id
		|| ', legend_name := ' || COALESCE('''' || legend_name || '''', 'NULL')
		|| ', step_type := ' || COALESCE('''' || step_type || '''', 'NULL')
		|| ', min_value := ' || COALESCE(TRIM(to_char(min_value, '99999999D999999')), 'NULL')
		|| ', max_value := ' || COALESCE(TRIM(to_char(max_value, '99999999D999999')), 'NULL')	
		|| ', min_real_value := ' || COALESCE('''' || min_real_value || '''', 'NULL')
		|| ', max_real_value := ''' || COALESCE(max_real_value, 'NULL') || ''''
		|| ', colorbar := ''' || COALESCE(colorbar, 'NULL') || ''''		
		|| ', step := ' || COALESCE(TRIM(to_char(step, '99999999D999999')), 'NULL')
		|| ', step_range_from := ' || COALESCE(TRIM(to_char(step_range_from, '99999999D999999')), 'NULL')
		|| ', step_range_to := ' || COALESCE(TRIM(to_char(step_range_to, '99999999D999999')), 'NULL')
		|| ', unit := ' || COALESCE('''' || unit || '''', 'NULL')
		|| ' );'  as inserts	   
	FROM analysis.legend;

	

	RETURN QUERY SELECT 'SELECT analysis.update_insert_legend_step('
		|| ' legend_id := ' || legend_id
		|| ', from_step :=  ' || from_step
		|| ', to_step :=  ' || to_step		
		|| ', color_rgb := ' || COALESCE('''' || color_rgb || '''', 'NULL')
		|| ', color_label := ' || COALESCE('''' || color_label || '''', 'NULL')
		|| ', group_label := ' || COALESCE('''' || group_label || '''', 'NULL')
		|| ' );'  as inserts	   
	FROM analysis.legend_step;


	
	RETURN QUERY SELECT 'SELECT analysis.update_insert_product_legend('	
		|| ' productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', legend_id := ' || legend_id
		|| ', default_legend := ' || default_legend			
		|| ' );'  as inserts	   
	FROM analysis.product_legend;

	
																			
	RETURN QUERY SELECT 'SELECT analysis.update_insert_timeseries_drawproperties('
		|| ' productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')		
		|| ', title := ' || COALESCE('''' || title || '''', 'NULL')
		|| ', unit := ' || COALESCE('''' || unit || '''', 'NULL')		
		|| ', min := ' || COALESCE(TRIM(to_char(min, '99999999D999999')), 'NULL')
		|| ', max := ' || COALESCE(TRIM(to_char(max, '99999999D999999')), 'NULL')		
		|| ', oposite := ' || oposite				
		|| ', tsname_in_legend := ' || COALESCE('''' || tsname_in_legend || '''', 'NULL')
		|| ', charttype := ' || COALESCE('''' || charttype || '''', 'NULL')
		|| ', linestyle := ' || COALESCE('''' || linestyle || '''', 'NULL')
		|| ', linewidth := ' || COALESCE(TRIM(to_char(linewidth, '99999999')), 'NULL')
		|| ', color := ' || COALESCE('''' || color || '''', 'NULL')
		|| ', yaxes_id := ' || COALESCE('''' || yaxes_id || '''', 'NULL')
		|| ', title_color := ' || COALESCE('''' || title_color || '''', 'NULL')
		|| ' );'  as inserts	   
	FROM analysis.timeseries_drawproperties;	
	
	
	
	RETURN QUERY SELECT 'SELECT products.update_insert_spirits('
		|| '  productcode := ' || COALESCE('''' || productcode || '''', 'NULL')
		|| ', subproductcode := ' || COALESCE('''' || subproductcode || '''', 'NULL')
		|| ', version := ' || COALESCE('''' || version || '''', 'NULL')
		|| ', mapsetcode := ' || COALESCE('''' || mapsetcode || '''', 'NULL')
		|| ', prod_values := ' || COALESCE('''' || prod_values || '''', 'NULL')
		|| ', flags := ' || COALESCE('''' || flags || '''', 'NULL')
		|| ', data_ignore_value := ' || COALESCE(TRIM(to_char(data_ignore_value, '99999999')), 'NULL')
		|| ', days := ' || COALESCE(TRIM(to_char(days, '99999999')), 'NULL')
		|| ', start_date := ' || COALESCE(TRIM(to_char(start_date, '99999999')), 'NULL')
		|| ', end_date := ' || COALESCE(TRIM(to_char(end_date, '99999999')), 'NULL')	
		|| ', sensor_type := ' || COALESCE('''' || sensor_type || '''', 'NULL')
		|| ', comment := ' || COALESCE('''' || comment || '''', 'NULL')				
		|| ', sensor_filename_prefix := ' || COALESCE('''' || sensor_filename_prefix || '''', 'NULL')		
		|| ', frequency_filename_prefix := ' || COALESCE('''' || frequency_filename_prefix || '''', 'NULL')		
		|| ', product_anomaly_filename_prefix := ' || COALESCE('''' || product_anomaly_filename_prefix || '''', 'NULL')
		|| ', activated := ' || activated						
		|| ' );'  as inserts	   
	FROM products.spirits;	

	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
  
ALTER FUNCTION products.export_jrc_data(boolean)
  OWNER TO estation;

  