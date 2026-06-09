<?php

namespace Database\Data;

use App\Enums\TeachingType;
use Database\Data\Sections\IntroSections;
use Database\Data\Sections\InnerSections;

class PageData
{
   /**
    * Get all pages data for seeding
    */
   public static function getAllPages(): array
   {
      return [
         ...self::getHomePages(),
         ...self::getInnerPages(),
      ];
   }

   /**
    * Get home pages data
    */
   public static function getHomePages(): array
   {
      return [
         // Home page 1
         [
            'name' => 'Collaborative 1',
            'slug' => 'home-1',
            'type' => TeachingType::COLLABORATIVE->value,
            'title' => 'Appibrium - Home Page 1',
            'description' => 'Discover top categories, trending courses, expert instructors, and more.',
            'meta_description' => 'Appibrium Home 1: Find your perfect course, learn from the best instructors, and join our community. Developed by Appibrium.',
            'meta_keywords' => 'online courses, best instructors, trending, categories, testimonials',
            'sections' => IntroSections::getHome1Sections(),
         ],
         // Home page 2
         [
            'name' => 'Collaborative 2',
            'slug' => 'home-2',
            'type' => TeachingType::COLLABORATIVE->value,
            'title' => 'Appibrium - Home Page 2',
            'description' => 'Discover top categories, trending courses, expert instructors, and more.',
            'meta_description' => 'Appibrium Home 2: Find your perfect course, learn from the best instructors, and join our community. Developed by Appibrium.',
            'meta_keywords' => 'online courses, best instructors, trending, categories, testimonials',
            'sections' => IntroSections::getHome2Sections(),
         ],
         // Home page 3
         [
            'name' => 'Collaborative 3',
            'slug' => 'home-3',
            'type' => TeachingType::COLLABORATIVE->value,
            'title' => 'Appibrium - Online Learning Platform',
            'description' => 'Learn from expert instructors with our wide range of online courses.',
            'meta_description' => 'Appibrium offers 5,500+ online courses taught by 400+ trusted instructors across various categories. Developed by Appibrium.',
            'meta_keywords' => 'online courses, e-learning, LMS, instructor-led, training, education',
            'sections' => IntroSections::getHome3Sections(),
         ],
         // Home page 4
         [
            'name' => 'Administrative 1',
            'slug' => 'home-4',
            'type' => TeachingType::ADMINISTRATIVE->value,
            'title' => 'Appibrium - Advanced Learning Platform',
            'description' => 'Immersive learning experience with AR/VR technology and expert-led courses',
            'meta_description' => 'Appibrium: Experience next-generation learning with immersive courses, expert instructors, and cutting-edge educational technology. Developed by Appibrium.',
            'meta_keywords' => 'AR/VR learning, immersive education, online courses, virtual reality education, expert instructors',
            'sections' => IntroSections::getHome4Sections(),
         ],
         // Home page 5
         [
            'name' => 'Administrative 2',
            'slug' => 'home-5',
            'type' => TeachingType::ADMINISTRATIVE->value,
            'title' => 'Appibrium - Advanced Learning Platform',
            'description' => 'Immersive learning experience with AR/VR technology and expert-led courses',
            'meta_description' => 'Appibrium: Experience next-generation learning with immersive courses, expert instructors, and cutting-edge educational technology. Developed by Appibrium.',
            'meta_keywords' => 'AR/VR learning, immersive education, online courses, virtual reality education, expert instructors',
            'sections' => IntroSections::getHome5Sections(),
         ],
      ];
   }

   /**
    * Get policy pages data
    */
   public static function getInnerPages(): array
   {
      return [
         // About Us page
         [
            'name' => 'About Us',
            'slug' => 'about-us',
            'type' => 'inner_page',
            'title' => 'About Us - Why Choose Appibrium?',
            'meta_description' => 'Appibrium offers quality content, affordable learning, and continuous improvement in online education. Developed by Appibrium.',
            'meta_keywords' => 'about us, mission, vision, quality content, affordable learning, education platform',
            'sections' => InnerSections::getAboutUsSections()
         ],
         // Our Team page
         [
            'name' => 'Our Team',
            'slug' => 'our-team',
            'type' => 'inner_page',
            'title' => 'Our Team - Meet the People Behind Appibrium',
            'meta_description' => 'Meet the Appibrium team - passionate educators, skilled developers, and dedicated professionals working to democratize education. Developed by Appibrium.',
            'meta_keywords' => 'our team, about team, Appibrium team, leadership, educators, developers, support staff',
            'sections' => InnerSections::getOurTeamSections()
         ],
         // Careers page
         [
            'name' => 'Careers',
            'slug' => 'careers',
            'type' => 'inner_page',
            'title' => 'Careers - Join Our Mission at Appibrium',
            'meta_description' => 'Join the Appibrium team and help transform education. Explore career opportunities, company culture, and growth prospects. Developed by Appibrium.',
            'meta_keywords' => 'careers, jobs, employment, Appibrium jobs, education careers, remote work, software engineer, product manager',
            'sections' => []
         ],
         // Contact Us page
         [
            'name' => 'Address',
            'slug' => 'contact-us',
            'type' => 'inner_page',
            'title' => 'Contact Us - Get in Touch with Appibrium',
            'description' => InnerSections::getContactUsDescription(),
            'meta_description' => 'Contact Appibrium for support, partnerships, careers, or general inquiries. Find all our contact information and office details. Developed by Appibrium.',
            'meta_keywords' => 'contact us, support, help, contact information, customer service, partnerships, feedback',
            'sections' => []
         ],
         // Cookie Policy page
         [
            'name' => 'Cookie Policy',
            'slug' => 'cookie-policy',
            'type' => 'inner_page',
            'title' => 'Cookie Policy',
            'description' => InnerSections::getCookiePolicyDescription(),
            'meta_description' => 'Appibrium Cookie Policy: Learn about how we use cookies and similar technologies on our platform. Developed by Appibrium.',
            'meta_keywords' => 'cookie policy, cookies, privacy, tracking, web cookies, http cookies',
            'sections' => []
         ],
         // Terms and Conditions page
         [
            'name' => 'Terms and Conditions',
            'slug' => 'terms-and-conditions',
            'type' => 'inner_page',
            'title' => 'Terms and Conditions',
            'description' => InnerSections::getTermsAndConditionsDescription(),
            'meta_description' => 'Read Appibrium Terms and Conditions to understand your rights and responsibilities while using our platform. Developed by Appibrium.',
            'meta_keywords' => 'terms, conditions, terms of service, legal agreement, user agreement',
            'sections' => []
         ],
         // Privacy Policy page
         [
            'name' => 'Privacy Policy',
            'slug' => 'privacy-policy',
            'type' => 'inner_page',
            'title' => 'Privacy Policy',
            'description' => InnerSections::getPrivacyPolicyDescription(),
            'meta_description' => 'Learn about how Appibrium collects, uses, and protects your personal information in our Privacy Policy. Developed by Appibrium.',
            'meta_keywords' => 'privacy policy, data protection, personal information, data collection, data security',
            'sections' => []
         ],
         // Refund Policy page
         [
            'name' => 'Refund Policy',
            'slug' => 'refund-policy',
            'type' => 'inner_page',
            'title' => 'Refund Policy',
            'description' => InnerSections::getRefundPolicyDescription(),
            'meta_description' => 'Learn about Appibrium refund conditions and processes for course purchases and other services. Developed by Appibrium.',
            'meta_keywords' => 'refund policy, refunds, money back, course refund, payment returns',
            'sections' => []
         ],
      ];
   }
}
