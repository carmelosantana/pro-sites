jQuery( document ).ready( function ( $ ) {

    Taxamo.subscribe( 'taxamo.prices.updated', function ( data ) {
        integrate_taxamo( data );
    } );

    /**
     * Better change things if the user changes country
     */
    Taxamo.subscribe( 'taxamo.country.detected', function ( data ) {
        integrate_taxamo( data );
    } );


    /**
     * Are we using Taxamo?
     *
     * If its an EU location (tax_supported) return true, else false.
     */
    function is_taxamo() {

        if( Taxamo.calculatedLocation !== undefined || typeof Taxamo.calculatedLocation !== 'undefined' ) {
            return Taxamo.calculatedLocation.tax_supported
        } else {
            return false;
        }

    }


    function integrate_taxamo( data ) {
        var use_taxamo = is_taxamo();

        if( use_taxamo ) {

            // Set Taxamo
            if( $( '[name="tax-type"]' ).val() != 'taxamo' ) {
                $( '[name="tax-type"]' ).attr( 'data-old', $( '[name="tax-type"]' ).val() );
            }
            $( '[name="tax-type"]' ).val( 'taxamo' );

            // Update Primary Display Prices
            $.each( $( '.price-plain.hidden' ), function ( index, value ) {
                var amount = $( value ).find( '.tax-total' ).html();
                var percentage = $( value ).find( '.tax-rate' ).html();

                var run_once = false;

                if ( typeof amount !== 'undefined' ) {
                    amount = amount.split( '.' );

                    if ( !run_once && use_taxamo ) {
                        $( '.tax-checkout-notice .tax-percentage' ).html( percentage );
                        $( '.tax-checkout-notice' ).removeClass( 'hidden' );
                    } else if ( !run_once ) {
                        $( '.tax-checkout-notice' ).addClass( 'hidden' );
                    }

                    if ( 0 < amount[ 0 ] ) {
                        $( $( value ).prev() ).find( '.whole' ).html( amount[ 0 ] );
                    }

                    if ( 0 < amount[ 1 ] ) {
                        $( $( value ).prev() ).find( '.decimal' ).html( amount[ 1 ] );
                        $( $( value ).prev() ).find( '.dot' ).removeClass( 'hidden' );
                        $( $( value ).prev() ).find( '.decimal' ).removeClass( 'hidden' );
                    } else {
                        $( $( value ).prev() ).find( '.decimal' ).html( '' );
                        $( $( value ).prev() ).find( '.dot' ).addClass( 'hidden' );
                        $( $( value ).prev() ).find( '.decimal' ).addClass( 'hidden' );
                    }

                    run_once = true;
                }
            } );

            // Update monthly savings prices
            $.each( $( '.monthly-price-hidden, .savings-price-hidden' ), function ( index, value ) {
                var amount = $( value ).find( '.tax-total' ).html();
                if ( typeof amount !== 'undefined' ) {
                    if ( 0 < amount[ 0 ] ) {
                        var amount_string = $( $( value ).prev() ).html();
                        //var tax_base = $( value ).find( '.tax-base' ).html();
                        var replace_value = $( value ).attr('taxamo-amount-str');
                        amount_string = amount_string.replace( replace_value, amount );
                        $( $( value ).prev() ).html( amount_string );
                    }
                }
            } );

        } else {

            // Reset tax type
            if( typeof ($( '[name="tax-type"]' ).attr( 'data-old' )) !== 'undefined' ) {
                $( '[name="tax-type"]' ).val( $( '[name="tax-type"]' ).attr( 'data-old' ) );
            }

            // Update Primary Display Prices
            $( '.tax-checkout-notice' ).addClass( 'hidden' );
            $.each( $( '.price-plain.hidden' ), function ( index, value ) {
                var amount = $( value ).attr('taxamo-amount-str');
                //console.log( amount );
                if ( typeof amount !== 'undefined' ) {
                    amount = amount.split( '.' );

                    if ( 0 < amount[ 0 ] ) {
                        $( $( value ).prev() ).find( '.whole' ).html( amount[ 0 ] );
                    }

                    if ( 0 < amount[ 1 ] ) {
                        $( $( value ).prev() ).find( '.decimal' ).html( amount[ 1 ] );
                        $( $( value ).prev() ).find( '.dot' ).removeClass( 'hidden' );
                        $( $( value ).prev() ).find( '.decimal' ).removeClass( 'hidden' );
                    } else {
                        $( $( value ).prev() ).find( '.decimal' ).html( '' );
                        $( $( value ).prev() ).find( '.dot' ).addClass( 'hidden' );
                        $( $( value ).prev() ).find( '.decimal' ).addClass( 'hidden' );
                    }
                }
            } );

            // Reset monthly savings prices
            $.each( $( '.monthly-price-hidden, .savings-price-hidden' ), function ( index, value ) {
                var original = $( value ).attr('taxamo-original-content');
                if ( typeof original !== 'undefined' ) {
                    $( $( value ).prev() ).html( original );
                }
            } );

        }


    }


    function get_countries_array( dictionary ) {
        var countries = [];
        $.each( dictionary, function( key, value ) {
            countries.push( value['tax_number_country_code'] );
        } ) ;
        return countries;
    }

} );