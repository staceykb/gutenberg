<?php
/**
 * REST API: Gutenberg_REST_Templates_Controller class
 *
 * @package    Gutenberg
 * @subpackage REST_API
 */

/**
 * Base Templates REST API Controller.
 */
class Gutenberg_REST_Navigation_Controller extends WP_REST_Posts_Controller {

	/**
	 * Registers the controllers routes.
	 *
	 * @return void
	 */
	public function register_routes() {

		parent::register_routes();

		// Lists a single nav item based on the given id.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\/\w\d-]+)',
			array(
				'args'        => array(
					'id' => array(
						'description' => __( 'The slug identifier for a Navigation', 'gutenberg' ),
						'type'        => 'string',
					),
				),
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::READABLE ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(
						'force' => array(
							'type'        => 'boolean',
							'default'     => false,
							'description' => __( 'Whether to bypass Trash and force deletion.' ),
						),
					),
				),
				'allow_batch' => $this->allow_batch,
				'schema'      => array( $this, 'get_public_item_schema' ),
			)
		);
	}


	protected function prepare_item_for_database( $request ) {

		$existing_post = $this->get_post( $request['id'] );

		if ( ! is_wp_error( $existing_post ) ) {
			// prepare_item_for_database expects a postId as the id field of the request.
			// it is used for functions such as get_post_type_object.
			// therefore we retrieve the ID of any existing post and overload the ID
			// of the request to use the postId. This ensures `update` requests are handled
			// correctly.
			$request['id'] = $existing_post->ID;
		}

		return parent::prepare_item_for_database( $request );

	}




	/**
	 * Overide WP_REST_Posts_Controller parent function to query for
	 * `wp_navigation` posts by post_name / slug instead of ID.
	 *
	 * This allows all the permission check handlers to find the WP_Post
	 * from the $request['id'] and continue as per their implementations
	 * in WP_REST_Posts_Controller therefore avoiding us overloading them
	 * in this class.
	 *
	 * @param string $id the slug of the Navigation post.
	 * @return WP_Post|null
	 */
	protected function get_post( $id ) {

		// Handle ID based id param.
		if ( ! is_string( $id ) ) {
			return parent::get_post( $id );
		}

		$args = array(
			'name'                   => $id, // query by slug
			'post_type'              => $this->post_type,
			'nopaging'               => true,
			'posts_per_page'         => '-1',
			'update_post_term_cache' => false,
			'no_found_rows'          => false,
		);

		// The Query
		$query = new WP_Query( $args );

		if ( empty( $query ) || empty( $query->post->ID ) || $this->post_type !== $query->post->post_type ) {
			return new WP_Error(
				'rest_post_not_found',
				__( 'No navigation found.' ),
				array( 'status' => 404 )
			);
		}

		return $query->post;
	}



}
