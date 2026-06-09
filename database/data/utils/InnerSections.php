<?php

namespace Database\Data\Sections;

class InnerSections
{
   /**
    * Get About Us sections data
    */
   public static function getAboutUsSections(): array
   {
      $sections = [
         [
            'name' => 'Hero',
            'slug' => 'hero',
            'title' => 'About Us',
            'flags' => [
               'title' => true,
            ],
            'properties' => [
               'array' => [
                  [
                     'title' => 'Our Mission',
                     'description' => 'To democratize education by making high-quality learning accessible to everyone, everywhere. We strive to bridge the gap between knowledge and application. Meet our passionate team of educators, developers, and designers who believe in the power of learning to change lives.',
                     'image' => '/assets/images/team-1.jpg'
                  ],
                  [
                     'title' => 'Our Value',
                     'description' => 'We believe in fostering a love for lifelong learning through innovative teaching methods, personalized experiences, and supportive communities. Meet our passionate team of educators, developers, and designers who believe in the power of learning to change lives.',
                     'image' => '/assets/images/team-2.jpg'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Success Statistics',
            'slug' => 'success_statistics',
            'title' => 'Our Success Depends on Our Students Success',
            'description' => 'We believe that our success is measured by our students\' achievements. Every milestone they reach is a testament to our commitment to excellence in education.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  [
                     'count' => '100+',
                     'title' => 'Active Students',
                     'image' => '/assets/images/students-1.jpg'
                  ],
                  [
                     'count' => '300+',
                     'title' => 'Best Courses',
                     'image' => '/assets/images/students-2.jpg'
                  ],
                  [
                     'count' => '40k+',
                     'title' => 'Active Users',
                     'image' => '/assets/images/students-3.jpg'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Team',
            'slug' => 'team',
            'title' => 'The Minds Behind the Mission',
            'description' => 'Meet our passionate team of educators, developers, and designers who believe in the power of learning to change lives. Meet our passionate team of educators, developers, and designers who believe in the power of learning to change lives.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'array' => [
                  [
                     'name' => 'Sarah Johnson',
                     'role' => 'Lead Instructor',
                     'image' => '/assets/images/users/user-1.jpg'
                  ],
                  [
                     'name' => 'Michael Chen',
                     'role' => 'Course Designer',
                     'image' => '/assets/images/users/user-2.jpg'
                  ],
                  [
                     'name' => 'Emily Rodriguez',
                     'role' => 'Learning Experience Manager',
                     'image' => '/assets/images/users/user-3.jpg'
                  ],
                  [
                     'name' => 'David Thompson',
                     'role' => 'Technology Director',
                     'image' => '/assets/images/users/user-4.jpg'
                  ],
                  [
                     'name' => 'Lisa Wang',
                     'role' => 'Student Success Coordinator',
                     'image' => '/assets/images/users/user-5.jpg'
                  ],
                  [
                     'name' => 'James Miller',
                     'role' => 'Content Strategist',
                     'image' => '/assets/images/users/user-6.jpg'
                  ],
                  [
                     'name' => 'Amanda Davis',
                     'role' => 'Quality Assurance Lead',
                     'image' => '/assets/images/users/user-7.jpg'
                  ],
                  [
                     'name' => 'Robert Kim',
                     'role' => 'Community Manager',
                     'image' => '/assets/images/users/user-8.jpg'
                  ]
               ]
            ],
         ],
         [
            'name' => 'Newsletter',
            'slug' => 'call_to_action',
            'title' => 'Newsletter',
            'sub_title' => 'Subscribe Our Newsletter',
            'description' => 'Subscribe to our newsletter to get the latest news and updates. We will not spam you.',
            'flags' => [
               'title' => true,
               'sub_title' => true,
               'description' => true,
            ],
            'properties' => [],
         ],
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
         $section['sort'] = $key + 1;
      }

      return $sections;
   }

   /**
    * Get Our Team sections data
    */
   public static function getOurTeamSections(): array
   {
      $sections = [
         [
            'name' => 'Top Instructors',
            'slug' => 'top_instructors',
            'title' => 'Meet Our Experts',
            'description' => 'Our team is a group of passionate educators, developers, & designers who believe in the power of learning to change lives.',
            'flags' => [
               'title' => true,
               'description' => true,
            ],
            'properties' => [
               'contents' => [2, 3, 4, 5, 6, 7, 8, 9] // Example instructor IDs
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
      ];

      foreach ($sections as $key => &$section) {
         $section['active'] = true;
         $section['sort'] = $key + 1;
      }

      return $sections;
   }

   /**
    * Get Contact Us sections data
    */
   public static function getContactUsDescription(): string
   {
      return '<h1 style="text-align: center;"><strong>Contact Us</strong></h1><p style="text-align: center;">We\'re here to help! Whether you have questions about our courses, need technical support, or want to provide feedback, we\'d love to hear from you. Here are the best ways to get in touch with our team.</p><h2><strong>General Inquiries</strong></h2><p>For general questions about Appibrium, our courses, or our platform, please email us at:</p><p><strong>Email: info@example.com</strong></p><h2><strong>Technical Support</strong></h2><p>If you\'re experiencing technical issues or need help with your account, our support team is ready to assist you:</p><p><strong>Email: support@uilib.com</strong></p><p>Response Time: We typically respond to support requests within 24 hours.</p><h2><strong>Partnership &amp; Business Inquiries</strong></h2><p>Interested in partnering with Appibrium or have business-related questions? Contact our business development team:</p><p><strong>Email: partnerships@example.com</strong></p><h2><strong>Career Opportunities</strong></h2><p>Looking to join our team? Visit our Careers page or send your resume to:</p><p><strong>Email: careers@example.com</strong></p><h2><strong>Feedback &amp; Suggestions</strong></h2><p>We value your feedback and are always looking for ways to improve. Share your thoughts and suggestions with us:</p><p><strong>Email: feedback@example.com</strong></p><h2><strong>Office Address</strong></h2><p><strong>Appibrium Headquarters</strong></p><p>123 Education Street Learning City, LC 12345 United States</p><p style="text-align: center;">Thank you for choosing Appibrium. We look forward to hearing from you!</p>';
   }

   /**
    * Get Cookie Policy sections data
    */
   public static function getCookiePolicyDescription(): string
   {
      return '<h1 style="text-align: center;"><strong>Cookie policy</strong></h1><h2><strong>Cookie policy</strong></h2><ol><li><p>Cookies are small text files that can be used by websites to make a user\'s experience more efficient.</p></li><li><p>The law states that we can store cookies on your device if they are strictly necessary for the operation of this site. For all other types of cookies we need your permission.</p></li><li><p>This site uses different types of cookies. Some cookies are placed by third party services that appear on our pages.</p></li></ol>';
   }

   /**
    * Get Terms and Conditions sections data
    */
   public static function getTermsAndConditionsDescription(): string
   {
      return '<h1 style="text-align: center;"><strong>Terms and Conditions</strong></h1><p>Welcome to Appibrium. By accessing and using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.</p><h2><strong>1. Acceptance of Terms</strong></h2><p>By accessing and using the Appibrium website and services, you accept and agree to be bound by these terms and conditions. If you do not agree with any part of these terms, you must not use our platform.</p><h2><strong>2. Use of the Platform</strong></h2><p>You agree to use Appibrium for lawful purposes only. You must not use our platform in any way that breaches any applicable local, national, or international law or regulation.</p><h2><strong>3. Account Registration</strong></h2><p>To access certain features of Appibrium, you may be required to create an account. You agree to provide accurate and complete information during the registration process and to keep your account information up to date.</p><h2><strong>4. User Conduct</strong></h2><p>You agree not to use Appibrium to:</p><ul><li><p>Post, upload, or distribute any content that is unlawful, defamatory, abusive, or otherwise objectionable.</p></li><li><p>Engage in any activity that could harm or disrupt the platform or other users\' experience.</p></li><li><p>Infringe upon the intellectual property rights of others.</p></li></ul><h2><strong>5. Intellectual Property</strong></h2><p>All content on Appibrium, including but not limited to text, graphics, logos, and software, is the property of Appibrium or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works based on our content without express written permission from Appibrium.</p><h2><strong>6. Payment and Refunds</strong></h2><p>Certain courses and services on Appibrium may be offered for a fee. All payments are non-refundable unless otherwise specified. Appibrium reserves the right to change its pricing at any time.</p><h2><strong>7. Termination</strong></h2><p>Appibrium reserves the right to terminate or suspend your account at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users of our platform.</p><h2><strong>8. Disclaimer of Warranties</strong></h2><p>Appibrium provides the platform and services \'as is\' and without any warranty or condition, express, implied, or statutory. We do not guarantee that the platform will be uninterrupted or error-free.</p><h2><strong>9. Limitation of Liability</strong></h2><p>In no event shall Appibrium be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the platform; (b) any unauthorized access to or use of our services; (c) any interruption or cessation of transmission to or from our services.</p><h2><strong>10. Changes to Terms</strong></h2><p>Appibrium reserves the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the platform after any changes constitutes your acceptance of the new terms.</p><h2><strong>11. Governing Law</strong></h2><p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Appibrium operates, without regard to its conflict of law principles.</p>';
   }

   /**
    * Get Privacy Policy sections data
    */
   public static function getPrivacyPolicyDescription(): string
   {
      return '<h1 style="text-align: center;"><strong>Privacy Policy</strong></h1><p>Welcome to Appibrium. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.</p><h2><strong>1. Information We Collect</strong></h2><p>We collect various types of information in connection with the services we provide, including:</p><ul><li><p><strong>Personal Information:</strong> When you register for an account, we may collect personal details such as your name, email address, phone number, and payment information.</p></li><li><p><strong>Usage Data:</strong> We collect information about your interactions with our platform, such as the pages you visit, the courses you access, and other actions you take.</p></li><li><p><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track your activity on our platform and hold certain information.</p></li></ul><h2><strong>2. How We Use Your Information</strong></h2><p>We use the information we collect for various purposes, including:</p><ul><li><p><strong>Providing Services:</strong> To create and manage your account, process transactions, and provide the courses and services you request.</p></li><li><p><strong>Improving Our Platform:</strong> To analyze usage patterns and improve the functionality and user experience of our platform.</p></li><li><p><strong>Communication:</strong> To send you updates, newsletters, and other information that may be of interest to you. You can opt-out of receiving these communications at any time.</p></li><li><p><strong>Security:</strong> To monitor and protect the security of our platform and its users.</p></li></ul><h2><strong>3. Sharing Your Information</strong></h2><p>We may share your information with third parties in the following circumstances:</p><ul><li><p><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and email delivery.</p></li><li><p><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p></li><li><p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p></li></ul><h2><strong>4. Data Security</strong></h2><p>We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee its absolute security.</p>';
   }

   /**
    * Get Refund Policy sections data
    */
   public static function getRefundPolicyDescription(): string
   {
      return '<h1 style="text-align: center;"><strong>Refund Policy</strong></h1><p>At Appibrium, we strive to provide the best learning experience for our users. We understand that there may be situations where you may need to request a refund. This Refund Policy outlines the conditions and processes for obtaining a refund for purchases made on our platform.</p><h2><strong>1. General Refund Policy</strong></h2><p>Our general refund policy applies to all courses and services offered on Appibrium. Refunds will be granted under the following conditions:</p><ul><li><p><strong>Course Not Accessed:</strong> If you have purchased a course and have not accessed any of its content, you may request a full refund within 14 days of the purchase date.</p></li><li><p><strong>Technical Issues:</strong> If you experience technical issues that prevent you from accessing the course content and we are unable to resolve the issue, you may request a refund within 14 days of the purchase date.</p></li></ul><h2><strong>2. Non-Refundable Items</strong></h2><p>Certain items and services are non-refundable. These include:</p><ul><li><p><strong>Downloaded Content:</strong> Any content that has been downloaded to your device is non-refundable.</p></li><li><p><strong>Completed Courses:</strong> If you have completed a course, it is not eligible for a refund.</p></li></ul><h2><strong>3. How to Request a Refund</strong></h2><p>To request a refund, please follow these steps:</p><ol><li><p><strong>Contact Support:</strong> Email our support team at <strong>support@uilib.com</strong> with your refund request. Include your order number, the course name, and the reason for the refund request.</p></li><li><p><strong>Review Process:</strong> Our support team will review your request and may ask for additional information to process your refund.</p></li><li><p><strong>Refund Approval:</strong> If your refund request meets the conditions outlined in this policy, we will process the refund to your original method of payment. Please allow 5-10 business days for the refund to appear in your account.</p></li></ol><h2><strong>4. Changes to Refund Policy</strong></h2><p>Appibrium reserves the right to modify this Refund Policy at any time. We will notify you of any changes by posting the new policy on this page. Your continued use of the platform after any changes constitutes your acceptance of the new policy.</p>';
   }
}
