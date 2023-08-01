<?php

	$name = trim($_POST['name']);
	$email = trim($_POST['email']);
	$message = trim($_POST['message']);
	
	$emailTo = 'example@mail.com'; //Put your own email address here
	if (empty($subject)) {
	    $subject = 'Message from your website.';
	}
	$body = "Name: $name \n\nEmail: $email \n\nMessage:\n$message";
	$headers = 'From: '.$email."\r\n" .
        'Reply-To: '.$email."\r\n";

	mail($emailTo, $subject, $body, $headers);
	$emailSent = true;
	echo ('SEND');
	
?>
