<?php

/*

Plugin Name: Are You Paying Attention Quiz
Description: Give your users a multiple choice question.
Version: 1.0
Author: Krupiceva

*/

if( ! defined('ABSPATH')) exit; //Exit if accessed directly

class AreYouPayingAttention{
    function __construct(){
        add_action('init', array($this, 'adminAssets'));
    }

    //Register JS file for this plugin
    function adminAssets(){
        wp_register_style('quizeditcss', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('ourplugin/are-you-paying-attention', array(
            'editor_script' => 'ournewblocktype',
            'editor_style' => 'quizeditcss',
            'render_callback' => array($this, 'theHTML')
        ));
    }

    //HTML for fronted part of block type ob website
    function theHTML($attributes){
        //Only if we are on frontend of the website not in the admin dashboard
        if(!is_admin()){
            //Load js and css only if this post have this block type, not in all posts
            wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
            wp_enqueue_style('attentionFrontendStyles', plugin_dir_url(__FILE__) . 'build/frontend.css');
        }
        ob_start(); ?>
        <div class="paying-attention-update-me"></div>
        <?php return ob_get_clean();
    }
}

$areYouPayingAttention = new AreYouPayingAttention();