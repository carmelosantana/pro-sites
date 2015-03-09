<?php

if ( ! class_exists( 'ProSites_Helper_ProSite' ) ) {

	class ProSites_Helper_ProSite {

		public static $last_site = false;

		public static function get_site( $blog_id ) {
			global $wpdb;
			self::$last_site = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->base_prefix}pro_sites WHERE blog_ID = %d", $blog_id ) );
			return self::$last_site;
		}

		public static function last_gateway( $blog_id ) {
			// Try to avoid another load
			if( ! empty( self::$last_site ) && self::$last_site->blog_ID = $blog_id ) {
				$site = self::$last_site;
			} else {
				$site = self::get_site( $blog_id );
			}

			if( ! empty( $site ) ) {
				return strtolower( $site->gateway );
			} else {
				return false;
			}

		}

	}
}