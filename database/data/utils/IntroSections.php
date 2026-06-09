<?php

namespace Database\Data\Sections;

class IntroSections
{
   /**
    * Get Home 1 sections data
    */
   public static function getHome1Sections(): array
   {
      $sections = [
         [
            'name' => 'Hero',
            'slug' => 'hero',
            'title' => 'YOUR JOURNEY BEGINS HERE',
            'sub_title' => 'Grow Your Knowledge with Leading Online Courses',
            'description' => "Start learning today with top-rated courses and instructors Take your team's learning and development to new heights Take your team's learning",
            'thumbnail' => '/assets/images/intro/home-1/hero-image.png',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [
               'button_text' => 'Browse Courses',
               'button_link' => '/courses/all',
               'ratings' => '5.0',
               'subscribers' => '+2000 readers worldwide',
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/avatars/avatar-1.png'],
                  ['image' => '/assets/avatars/avatar-2.png'],
                  ['image' => '/assets/avatars/avatar-3.png'],
                  ['image' => '/assets/avatars/avatar-4.png'],
                  ['image' => '/assets/avatars/avatar-5.png'],
                  ['image' => '/assets/avatars/avatar-6.png'],
               ]
            ],
         ],
         [
            'name' => 'Partners',
            'slug' => 'partners',
            'title' => 'Trusted by over 100 leading companies worldwide',
            'flags' => [
               'title' => true,
            ],
            'properties' => [
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/logos/logo-1.png'],
                  ['image' => '/assets/logos/logo-2.png'],
                  ['image' => '/assets/logos/logo-3.png'],
                  ['image' => '/assets/logos/logo-4.png'],
                  ['image' => '/assets/logos/logo-5.png'],
                  ['image' => '/assets/logos/logo-8.png'],
                  ['image' => '/assets/logos/logo-6.png'],
                  ['image' => '/assets/logos/logo-7.png'],
               ]
            ],
         ],
         [
            'name' => 'Top Categories',
            'slug' => 'top_categories',
            'title' => 'Top Categories',
            'sub_title' => 'Featured category',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7, 8, 9] // Example category IDs or slugs
            ],
         ],
         [
            'name' => 'Top Courses',
            'slug' => 'top_courses',
            'title' => 'Courses',
            'sub_title' => 'Popular Courses',
            'description' => 'Your professional development is supported by Mentor covering everything from technical subjects to essential abilities.',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6]
            ],
         ],
         [
            'name' => 'Overview',
            'slug' => 'overview',
            'flags' => [],
            'properties' => [
               'array' => [
                  ['icon' => "", 'count' => "", 'color' => "", 'title' => ""],
                  [
                     'icon' => 'users',
                     'count' => '68k+',
                     'color' => 'rgba(52,105,154,1)',
                     'title' => 'Join 68k+ students already mastering new skills.'
                  ],
                  [
                     'icon' => 'download',
                     'count' => '32k+',
                     'color' => 'rgba(255,203,97,1)',
                     'title' => 'Downloaded over 32,000 times by users worldwide.'
                  ],
                  [
                     'icon' => 'heart',
                     'count' => '45k+',
                     'color' => 'rgba(74,151,130,1)',
                     'title' => 'Loved by learners with 45k+ great reviews.'
                  ],
                  [
                     'icon' => 'award',
                     'count' => '1.2k+',
                     'color' => 'rgba(121,158,255,1)',
                     'title' => 'Recognized with more than 1,200 prestigious accolades.'
                  ],
               ]
            ],
         ],
         [
            'name' => 'New Courses',
            'slug' => 'new_courses',
            'title' => 'Courses',
            'sub_title' => 'Latest Courses',
            'description' => 'Your professional development is supported by Mentor covering everything from technical subjects to essential abilities.',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6]
            ],
         ],
         [
            'name' => 'Top Instructors',
            'slug' => 'top_instructors',
            'title' => 'Top Instructors',
            'sub_title' => 'Meet Our Experts',
            'description' => 'They efficiently serve large number of students on our platform',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7] // Example instructor IDs
            ],
         ],
         [
            'name' => 'FAQs',
            'slug' => 'faqs',
            'title' => 'FAQ',
            'sub_title' => 'Frequently Asked Questions!',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen',
            'thumbnail' => '/assets/images/intro/home-1/faqs.png',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [
               'array' => [
                  ['title' => "", 'description' => ""],
                  [
                     'title' => 'Do I need any prior experience to take your courses?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether you're a complete beginner or looking to sharpen existing skills, you'll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'How long do I have access to the course materials?',
                     'description' => "Once enrolled, you have lifetime access to all course materials. You can learn at your own pace and revisit content whenever you need a refresher."
                  ],
                  [
                     'title' => 'Will I get a certificate after completing a course?',
                     'description' => "Yes! Upon successful completion of a course, you'll receive a certificate of completion that you can share on your LinkedIn profile or include in your portfolio."
                  ],
                  [
                     'title' => 'Can I ask questions or get support during the course?',
                     'description' => "Absolutely! Each course includes a discussion section where you can ask questions, share insights, and connect with other learners. I personally monitor and respond to questions."
                  ],
                  [
                     'title' => "What if I'm not satisfied with the course?",
                     'description' => "I offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, you can request a full refund within 30 days of enrollment."
                  ]
               ]
            ],
         ],
         [
            'name' => 'Blogs',
            'slug' => 'blogs',
            'title' => 'Blogs',
            'sub_title' => 'Our Latest Post',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
            ],
         ],
         [
            'name' => 'Newsletter',
            'slug' => 'call_to_action',
            'title' => 'Subscribe Our Newsletter',
            'description' => 'Subscribe to our newsletter to get the latest news and updates. We will not spam you.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'button_text' => 'Subscribe',
               'subscribers' => '+2000 readers worldwide',
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/avatars/avatar-1.png'],
                  ['image' => '/assets/avatars/avatar-2.png'],
                  ['image' => '/assets/avatars/avatar-3.png'],
                  ['image' => '/assets/avatars/avatar-4.png'],
                  ['image' => '/assets/avatars/avatar-5.png'],
                  ['image' => '/assets/avatars/avatar-6.png'],
               ]
            ],
         ],
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
      }

      return $sections;
   }

   /**
    * Get Home 2 sections data
    */
   public static function getHome2Sections(): array
   {
      $sections = [
         [
            'name' => 'Hero',
            'slug' => 'hero',
            'title' => 'YOUR JOURNEY BEGINS HERE',
            'sub_title' => 'Unlock 5,500+ Expert-Led Courses Powered by 400+ Trusted Instructors',
            'description' => "Start learning today with top-rated courses and instructors.",
            'thumbnail' => '/assets/images/intro/home-2/hero-image.png',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [],
         ],
         [
            'name' => 'Top Categories',
            'slug' => 'top_categories',
            'title' => 'Top Categories',
            'sub_title' => 'Explore by Category',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] // Example category IDs or slugs
            ],
         ],
         [
            'name' => 'Overview',
            'slug' => 'overview',
            'title' => 'We Provide',
            'sub_title' => 'Take Your Skills to the Next Level',
            'description' => 'These are the most popular courses among listen courses learners worldwide.',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['icon' => "", 'count' => "", 'title' => ""],
                  ['icon' => 'clock', 'count' => '212+', 'title' => 'Hours Course Time'],
                  ['icon' => 'monitor-play', 'count' => '15+', 'title' => 'Creative Courses'],
                  ['icon' => 'users', 'count' => '6+', 'title' => 'Number of Students'],
               ]
            ],
         ],
         [
            'name' => 'Top Courses',
            'slug' => 'top_courses',
            'title' => 'Top Courses',
            'sub_title' => 'Popular Right Now',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6]
            ],
         ],
         [
            'name' => 'New Courses',
            'slug' => 'new_courses',
            'title' => 'New Courses',
            'sub_title' => 'Recently Added',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6]
            ],
         ],
         [
            'name' => 'Top Instructors',
            'slug' => 'top_instructors',
            'title' => 'Top Instructors',
            'sub_title' => 'Meet Our Experts',
            'description' => 'They efficiently serve large number of students on our platform',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7] // Example instructor IDs
            ],
         ],
         [
            'name' => 'Testimonials',
            'slug' => 'testimonials',
            'title' => 'Testimonials',
            'sub_title' => 'What Client Say About Us',
            'description' => 'They efficiently serve large number of students on our platform',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['name' => "", 'image' => "", 'rating' => 0, 'description' => ""],
                  [
                     'name' => 'John Smith',
                     'image' => '/assets/images/users/user-1.jpg',
                     'rating' => 5,
                     'description' => 'John is an experienced web developer with 10+ years of experience in building modern web applications.'
                  ],
                  [
                     'name' => 'Emma Johnson',
                     'image' => '/assets/images/users/user-2.jpg',
                     'rating' => 4,
                     'description' => 'Emma is a talented UX designer who specializes in creating intuitive user interfaces for web and mobile applications.'
                  ],
                  [
                     'name' => 'Michael Chen',
                     'image' => '/assets/images/users/user-3.jpg',
                     'rating' => 5,
                     'description' => 'Michael is a data scientist with expertise in machine learning algorithms and data analysis techniques.'
                  ],
                  [
                     'name' => 'Sarah Williams',
                     'image' => '/assets/images/users/user-4.jpg',
                     'rating' => 4,
                     'description' => 'Sarah is a digital marketing expert who helps businesses grow their online presence through effective marketing strategies.'
                  ],
                  [
                     'name' => 'David Rodriguez',
                     'image' => '/assets/images/users/user-5.jpg',
                     'rating' => 5,
                     'description' => 'David is a mobile application developer with expertise in both iOS and Android platforms.'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Partners',
            'slug' => 'partners',
            'title' => 'Brands',
            'sub_title' => 'We Work With',
            'description' => 'Trusted by over 16,000 companies and millions of learners around the world',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/logos/logo-1.png'],
                  ['image' => '/assets/logos/logo-2.png'],
                  ['image' => '/assets/logos/logo-3.png'],
                  ['image' => '/assets/logos/logo-4.png'],
                  ['image' => '/assets/logos/logo-5.png'],
                  ['image' => '/assets/logos/logo-6.png'],
                  ['image' => '/assets/logos/logo-7.png'],
                  ['image' => '/assets/logos/logo-8.png']
               ]
            ],
         ],
         [
            'name' => 'Call to Action',
            'slug' => 'call_to_action',
            'title' => 'Subscribe Our Newsletter',
            'description' => 'Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed magna purus, fermentum eu',
            'thumbnail' => '/assets/images/intro/home-2/cta-image.png',
            'flags' => [
               'title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [
               'button_text' => 'Subscribe',
            ],
         ],
         [
            'name' => 'Blogs',
            'slug' => 'blogs',
            'title' => 'Blogs',
            'sub_title' => 'Our Latest Post',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
            ],
         ],
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
         $section['sort'] = $key + 1;
      }

      return $sections;
   }

   /**
    * Get Home 3 sections data
    */
   public static function getHome3Sections(): array
   {
      $sections = [
         [
            'name' => 'Hero',
            'slug' => 'hero',
            'title' => 'YOUR JOURNEY BEGINS HERE',
            'sub_title' => 'Grow Your Knowledge with Leading Online Courses',
            'description' => "Take your team's learning and development to new heights.",
            'thumbnail' => '/assets/images/intro/home-3/hero-image.png',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [
               'button_text' => 'Browse Courses',
               'button_link' => '/courses/all',
               'array' => [
                  ['label' => "", 'value' => ""],
                  [
                     'label' => 'Students',
                     'value' => '12k',
                  ],
                  [
                     'label' => 'Students',
                     'value' => '12k',
                  ],
                  [
                     'label' => 'Graduates',
                     'value' => '50k',
                  ]
               ]
            ],
         ],
         [
            'name' => 'Overview',
            'slug' => 'overview',
            'title' => 'Take Your Skills To the Next Level',
            'description' => 'These are the most popular courses among listen courses learners worldwide. These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['icon' => "", 'count' => "", 'title' => ""],
                  ['icon' => 'clock', 'count' => '212+', 'title' => 'Hours Course Time'],
                  ['icon' => 'monitor-play', 'count' => '15+', 'title' => 'Creative Courses'],
                  ['icon' => 'users', 'count' => '6+', 'title' => 'Number of Students'],
               ]
            ],
         ],
         [
            'name' => 'Partners',
            'slug' => 'partners',
            'title' => 'Adopted by renowned enterprises such as',
            'flags' => [
               'title' => true,
            ],
            'properties' => [
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/logos/logo-1.png'],
                  ['image' => '/assets/logos/logo-2.png'],
                  ['image' => '/assets/logos/logo-3.png'],
                  ['image' => '/assets/logos/logo-4.png'],
                  ['image' => '/assets/logos/logo-5.png'],
               ]
            ],
         ],
         [
            'name' => 'Category Courses',
            'slug' => 'category_courses',
            'title' => 'Everything you need to know in one place',
            'description' => 'Your professional development is supported by Appibrium, covering everything from technical subjects to essential abilities.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'content_limit' => 6,
               'button_text' => 'View More',
               'button_link' => '/courses/all',
               'contents' => [2, 3, 4, 5, 6, 7]
            ],


         ],
         [
            'name' => 'Top Instructors',
            'slug' => 'top_instructors',
            'title' => 'Meet Our Experts',
            'description' => 'They efficiently serve large number of students on our platform',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7] // Example instructor IDs
            ],
         ],
         [
            'name' => 'Features',
            'slug' => 'features',
            'flags' => [],
            'properties' => [
               'array' => [
                  ['title' => "", 'image' => "", 'description' => ""],
                  [
                     'title' => 'Learn Anything Anywhere',
                     'image' => '/assets/icons/globe-earth.png',
                     'description' => 'Where ever you are you can learn using our online education platform. Where ever you are you can learn.',
                  ],
                  [
                     'title' => 'World Class Instructors',
                     'image' => '/assets/icons/student.png',
                     'description' => 'Where ever you are you can learn using our online education platform. Where ever you are you can learn.',
                  ],
                  [
                     'title' => 'Lifetime Access',
                     'image' => '/assets/icons/laptop.png',
                     'description' => 'Where ever you are you can learn using our online education platform. Where ever you are you can learn.',
                  ]
               ]
            ],
         ],
         [
            'name' => 'Top Categories',
            'slug' => 'top_categories',
            'title' => 'Featured category',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            ],
         ],
         [
            'name' => 'New Courses',
            'slug' => 'new_courses',
            'title' => 'Latest Courses',
            'description' => 'Check out the latest additions to our course library.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6]
            ],
         ],
         [
            'name' => 'Testimonials',
            'slug' => 'testimonials',
            'title' => 'What our customers say',
            'description' => 'Hear from our learners about their experiences.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['name' => "", 'image' => "", 'rating' => 0, 'description' => ""],
                  [
                     'name' => 'John Smith',
                     'image' => '/assets/images/users/user-1.jpg',
                     'rating' => 5,
                     'description' => 'John is an experienced web developer with 10+ years of experience in building modern web applications.'
                  ],
                  [
                     'name' => 'Emma Johnson',
                     'image' => '/assets/images/users/user-2.jpg',
                     'rating' => 4,
                     'description' => 'Emma is a talented UX designer who specializes in creating intuitive user interfaces for web and mobile applications.'
                  ],
                  [
                     'name' => 'Michael Chen',
                     'image' => '/assets/images/users/user-3.jpg',
                     'rating' => 5,
                     'description' => 'Michael is a data scientist with expertise in machine learning algorithms and data analysis techniques.'
                  ],
                  [
                     'name' => 'Sarah Williams',
                     'image' => '/assets/images/users/user-4.jpg',
                     'rating' => 4,
                     'description' => 'Sarah is a digital marketing expert who helps businesses grow their online presence through effective marketing strategies.'
                  ],
                  [
                     'name' => 'David Rodriguez',
                     'image' => '/assets/images/users/user-5.jpg',
                     'rating' => 5,
                     'description' => 'David is a mobile application developer with expertise in both iOS and Android platforms.'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Call to Action',
            'slug' => 'call_to_action',
            'title' => 'Subscribe for course updates & discounts',
            'description' => 'Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed magna purus, fermentum eu',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'button_text' => 'Subscribe',
               'subscribers' => '+2000 readers worldwide',
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/avatars/avatar-1.png'],
                  ['image' => '/assets/avatars/avatar-2.png'],
                  ['image' => '/assets/avatars/avatar-3.png'],
                  ['image' => '/assets/avatars/avatar-4.png'],
                  ['image' => '/assets/avatars/avatar-5.png'],
                  ['image' => '/assets/avatars/avatar-6.png'],
               ]
            ],
         ],
         [
            'name' => 'Blogs',
            'slug' => 'blogs',
            'title' => 'Best Rated Posts',
            'description' => 'Read our top blog posts and articles.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
            ],
         ],
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
         $section['sort'] = $key + 1;
      }

      return $sections;
   }

   /**
    * Get Home 4 sections data
    */
   public static function getHome4Sections(): array
   {
      $sections = [
         [
            'name' => 'Hero',
            'slug' => 'hero',
            'title' => "Mastering Figma A Beginner's Guide to Digital Design",
            'description' => 'Learn with a dedicated instructor guiding you every step of the way. Gain hands-on experience, develop real-world design skills, And achieve your creative goals with confidence.',
            'thumbnail' => '/assets/images/intro/home-4/hero-image.png',
            'background_image' => '/assets/images/intro/home-4/hero-bg.png',
            'video_url' => 'https://youtu.be/6nDmtt1I4TY?si=CCMNgBqcFP9HPvaO',
            'flags' => [
               'title' => true,
               'description' => true,
               'thumbnail' => true,
               'background_image' => true,
               'video_url' => true,
            ],
            'properties' => [
               'button_text_1' => 'Browse Courses',
               'button_link_1' => '/courses/all',
               'button_text_2' => 'Get Started Today',
               'button_link_2' => '/login',
               'ratings' => '5.0',
               'subscribers' => '+2000 readers worldwide',
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/images/intro/home-4/card-1.png'],
                  ['image' => '/assets/images/intro/home-4/card-2.png'],
                  ['image' => '/assets/images/intro/home-4/card-3.png'],
                  ['image' => '/assets/images/intro/home-4/card-4.png']
               ],
            ],
         ],
         [
            'name' => 'Partners',
            'slug' => 'partners',
            'flags' => [],
            'properties' => [
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/logos/logo-1.png'],
                  ['image' => '/assets/logos/logo-2.png'],
                  ['image' => '/assets/logos/logo-3.png'],
                  ['image' => '/assets/logos/logo-4.png'],
                  ['image' => '/assets/logos/logo-5.png'],
                  ['image' => '/assets/logos/logo-6.png'],
                  ['image' => '/assets/logos/logo-7.png'],
                  ['image' => '/assets/logos/logo-8.png']
               ]
            ],
         ],
         [
            'name' => 'Top Categories',
            'slug' => 'top_categories',
            'title' => 'Top Categories',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen courses.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4]
            ],
         ],
         [
            'name' => 'Top Course',
            'slug' => 'top_course',
            'title' => 'Top Course',
            'flags' => [
               'title' => true,
            ],
            'properties' => [
               'button_text' => 'Buy Now',
               'contents' => [5]
            ],
         ],
         [
            'name' => 'Overview',
            'slug' => 'overview',
            'flags' => [],
            'properties' => [
               'array' => [
                  [
                     'icon' => "",
                     'count' => "",
                     'bg_color' => "",
                     'text_color' => "",
                     'image' => "",
                     'title' => ""
                  ],
                  [
                     'icon' => 'users',
                     'count' => '68k+',
                     'bg_color' => 'rgba(249,217,128,1)',
                     'text_color' => 'rgba(20,26,33,1)',
                     'image' => '/assets/images/intro/home-4/overview-1.png',
                     'title' => 'Join 68k+ students already mastering new skills.'
                  ],
                  [
                     'icon' => 'download',
                     'count' => '32k+',
                     'bg_color' => 'rgba(112,78,231,1)',
                     'text_color' => 'rgba(255,255,255,1)',
                     'image' => '/assets/images/intro/home-4/overview-2.png',
                     'title' => 'Downloaded over 32,000 times by users worldwide.'
                  ],
                  [
                     'icon' => 'heart',
                     'count' => '45k+',
                     'bg_color' => 'rgba(223,200,253,1)',
                     'text_color' => 'rgba(20,26,33,1)',
                     'image' => '/assets/images/intro/home-4/overview-3.png',
                     'title' => 'Loved by learners with 45k+ great reviews.'
                  ],
                  [
                     'icon' => 'award',
                     'count' => '1.2k+',
                     'bg_color' => 'rgba(0,120,103,1)',
                     'text_color' => 'rgba(255,255,255,1)',
                     'image' => '/assets/images/intro/home-4/overview-4.png',
                     'title' => 'Recognized with more than 1,200 prestigious accolades.'
                  ],
               ]
            ],
         ],
         [
            'name' => 'Instructor',
            'slug' => 'instructor',
            'title' => 'Reasons to Learn with Me',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen',
            'thumbnail' => '/assets/images/users/user-7.jpg',
            'flags' => [
               'title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [
               'array' => [
                  ['icon' => "", 'title' => "", 'description' => ""],
                  [
                     'icon' => 'book',
                     'title' => 'Project-Based Learning',
                     'description' => 'Every course includes real-world projects to help you build a strong, job-ready portfolio.'
                  ],
                  [
                     'icon' => 'book-open-text',
                     'title' => 'Beginner-Friendly Teaching Style',
                     'description' => 'My lessons are designed to be simple, clear, and step-by-step — perfect for learners of all levels, especially beginners.'
                  ],
                  [
                     'icon' => 'monitor-play',
                     'title' => 'Real-World Experience',
                     'description' => "With over a decade of hands-on experience in web design and development, I bring practical insights you won’t find in textbooks."
                  ],
                  [
                     'icon' => 'headset',
                     'title' => 'Personalized Support',
                     'description' => "You’re never learning alone. I personally respond to questions and offer guidance to help you stay on track."
                  ]
               ]
            ],
         ],
         [
            'name' => 'FAQs',
            'slug' => 'faqs',
            'title' => 'Frequently Asked Questions!',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['title' => "", 'description' => ""],
                  [
                     'title' => 'Do I need any prior experience to take your courses?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'How long do I have access to the course materials?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'Will I get a certificate after completing a course?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'Can I ask questions or get support during the course?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'What if I’m not satisfied with the course?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'What is the refund policy?',
                     'description' => "We offer a 30-day money-back guarantee. If you’re not satisfied with your purchase, you can request a refund within 30 days of purchase. Please note that refunds are only available for unused course materials."
                  ],
                  [
                     'title' => 'How do I get access to the course materials?',
                     'description' => "Once you’ve enrolled, you’ll receive immediate access to all course materials. You can access them anytime, anywhere, on any device with an internet connection."
                  ],
                  [
                     'title' => 'How can I get help if I need it?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'What is the refund policy?',
                     'description' => "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, you can request a refund within 30 days of purchase. Please note that refunds are only available for unused course materials."
                  ],
               ]
            ],
         ],
         [
            'name' => 'Testimonials',
            'slug' => 'testimonials',
            'title' => 'Success Stories',
            'sub_title' => 'What Client Say About Us',
            'description' => 'They efficiently serve large number of students on our platform',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['name' => "", 'image' => "", 'rating' => 0, 'description' => ""],
                  [
                     'name' => 'John Smith',
                     'image' => '/assets/images/users/user-1.jpg',
                     'rating' => 5,
                     'description' => 'John is an experienced web developer with 10+ years of experience in building modern web applications.'
                  ],
                  [
                     'name' => 'Emma Johnson',
                     'image' => '/assets/images/users/user-2.jpg',
                     'rating' => 4,
                     'description' => 'Emma is a talented UX designer who specializes in creating intuitive user interfaces for web and mobile applications.'
                  ],
                  [
                     'name' => 'Michael Chen',
                     'image' => '/assets/images/users/user-3.jpg',
                     'rating' => 5,
                     'description' => 'Michael is a data scientist with expertise in machine learning algorithms and data analysis techniques.'
                  ],
                  [
                     'name' => 'Sarah Williams',
                     'image' => '/assets/images/users/user-4.jpg',
                     'rating' => 4,
                     'description' => 'Sarah is a digital marketing expert who helps businesses grow their online presence through effective marketing strategies.'
                  ],
                  [
                     'name' => 'David Rodriguez',
                     'image' => '/assets/images/users/user-5.jpg',
                     'rating' => 5,
                     'description' => 'David is a mobile application developer with expertise in both iOS and Android platforms.'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Blogs',
            'slug' => 'blogs',
            'title' => 'Best Rated Posts',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
            ],
         ],
         [
            'name' => 'Call to Action',
            'slug' => 'call_to_action',
            'title' => 'Subscribe to My Newsletter',
            'background_image' => '/assets/images/intro/home-4/cta-bg.png',
            'description' => "Stay ahead in digital design with curated insights, learning tips, and course updates every week.",
            'flags' => [
               'title' => true,
               'background_image' => true,
               'description' => true,
            ],
            'properties' => [
               'button_text' => 'Subscribe',
            ],
         ],
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
         $section['sort'] = $key + 1;
      }

      return $sections;
   }

   /**
    * Get Home 5 sections data
    */
   public static function getHome5Sections(): array
   {
      $sections = [
         [
            'name' => 'Hero',
            'slug' => 'hero',
            'flags' => [],
            'properties' => [
               'contents' => [1, 2]
            ],
         ],
         [
            'name' => 'Statistics',
            'slug' => 'statistics',
            'flags' => [],
            'properties' => [
               'array' => [
                  ['label' => "", 'value' => ""],
                  ['label' => 'Students', 'value' => '64k'],
                  ['label' => 'Good Comments', 'value' => '45k'],
                  ['label' => 'Service Download', 'value' => '32k'],
                  ['label' => 'Best Awards', 'value' => '129k+']
               ]
            ],
         ],
         [
            'name' => 'Top Categories',
            'slug' => 'top_categories',
            'title' => 'Categories',
            'sub_title' => 'Top Categories',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen courses learners worldwide categories',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4]
            ],
         ],
         [
            'name' => 'Top Course',
            'slug' => 'top_course',
            'title' => 'Top Course',
            'flags' => [
               'title' => true,
            ],
            'properties' => [
               'button_text' => 'Buy Now',
               'contents' => [1]
            ],
         ],
         [
            'name' => 'Top Courses',
            'slug' => 'top_courses',
            'title' => 'Courses',
            'sub_title' => 'Top Courses',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among courses',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4]
            ],
         ],
         [
            'name' => 'Instructor',
            'slug' => 'instructor',
            'title' => 'Instructor',
            'sub_title' => 'ABOUT ME',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen',
            'thumbnail' => '/assets/images/users/user-7.jpg',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
               'thumbnail' => true,
            ],
            'properties' => [
               'array' => [
                  ['icon' => "", 'title' => "", 'description' => ""],
                  [
                     'icon' => 'book',
                     'title' => 'Project-Based Learning',
                     'description' => 'Every course includes real-world projects to help you build a strong, job-ready portfolio.'
                  ],
                  [
                     'icon' => 'book-open-text',
                     'title' => 'Beginner-Friendly Teaching Style',
                     'description' => 'My lessons are designed to be simple, clear, and step-by-step — perfect for learners of all levels, especially beginners.'
                  ],
                  [
                     'icon' => 'monitor-play',
                     'title' => 'Real-World Experience',
                     'description' => "With over a decade of hands-on experience in web design and development, I bring practical insights you won’t find in textbooks."
                  ],
                  [
                     'icon' => 'headset',
                     'title' => 'Personalized Support',
                     'description' => "You’re never learning alone. I personally respond to questions and offer guidance to help you stay on track."
                  ]
               ]
            ],
         ],
         [
            'name' => 'FAQs',
            'slug' => 'faqs',
            'title' => 'FAQs',
            'sub_title' => 'FAQs',
            'description' => 'These are the most popular courses among listen courses learners worldwide these are the most popular courses among listen',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['title' => "", 'description' => ""],
                  [
                     'title' => 'Do I need any prior experience to take your courses?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'How long do I have access to the course materials?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'Will I get a certificate after completing a course?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'Can I ask questions or get support during the course?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ],
                  [
                     'title' => 'What if I’m not satisfied with the course?',
                     'description' => "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you’ll find step-by-step guidance to help you progress with confidence."
                  ]
               ]
            ],
         ],
         [
            'name' => 'Testimonials',
            'slug' => 'testimonials',
            'title' => 'Success Stories',
            'sub_title' => 'What Client Say About Us',
            'description' => 'They efficiently serve large number of students on our platform',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  ['name' => "", 'image' => "", 'rating' => 0, 'description' => ""],
                  [
                     'name' => 'John Smith',
                     'image' => '/assets/images/users/user-1.jpg',
                     'rating' => 5,
                     'description' => 'John is an experienced web developer with 10+ years of experience in building modern web applications.'
                  ],
                  [
                     'name' => 'Emma Johnson',
                     'image' => '/assets/images/users/user-2.jpg',
                     'rating' => 4,
                     'description' => 'Emma is a talented UX designer who specializes in creating intuitive user interfaces for web and mobile applications.'
                  ],
                  [
                     'name' => 'Michael Chen',
                     'image' => '/assets/images/users/user-3.jpg',
                     'rating' => 5,
                     'description' => 'Michael is a data scientist with expertise in machine learning algorithms and data analysis techniques.'
                  ],
                  [
                     'name' => 'Sarah Williams',
                     'image' => '/assets/images/users/user-4.jpg',
                     'rating' => 4,
                     'description' => 'Sarah is a digital marketing expert who helps businesses grow their online presence through effective marketing strategies.'
                  ],
                  [
                     'name' => 'David Rodriguez',
                     'image' => '/assets/images/users/user-5.jpg',
                     'rating' => 5,
                     'description' => 'David is a mobile application developer with expertise in both iOS and Android platforms.'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Call to Action',
            'slug' => 'call_to_action',
            'title' => 'Subscribe for course updates & discounts',
            'description' => 'Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed magna purus, fermentum eu',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'button_text' => 'Subscribe',
               'subscribers' => '+2000 readers worldwide',
               'array' => [
                  ['image' => ""],
                  ['image' => '/assets/avatars/avatar-1.png'],
                  ['image' => '/assets/avatars/avatar-2.png'],
                  ['image' => '/assets/avatars/avatar-3.png'],
                  ['image' => '/assets/avatars/avatar-4.png'],
                  ['image' => '/assets/avatars/avatar-5.png'],
                  ['image' => '/assets/avatars/avatar-6.png'],
               ]
            ],
         ],
         [
            'name' => 'Blogs',
            'slug' => 'blogs',
            'title' => 'Blogs',
            'sub_title' => 'Best Rated Posts',
            'description' => 'These are the most popular courses among listen courses learners worldwide',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
            ],
         ],
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
         $section['sort'] = $key + 1;
      }

      return $sections;
   }
}
