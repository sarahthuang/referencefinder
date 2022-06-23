<?php

   echo "3";
   if(isset($_FILES['files'])){
      $errors= array();
      $file_name = $_FILES['files']['name'];
      $file_size =$_FILES['files']['size'];
      $file_tmp =$_FILES['files']['tmp_name'];
      $file_type=$_FILES['files']['type'];
      $file_ext=strtolower(end(explode('.',$_FILES['files']['name'])));
      
      $extensions= array("jpeg","jpg","png", "html", "pdf");

      if(in_array($file_ext,$extensions)=== false){
         $errors[]="extension not allowed, please choose a JPEG or PNG file.";
      }
      
      if($file_size > 5000000){
         $errors[]='File size must be less than 5000000 kb';
      }
      
      if(empty($errors)==true){
         move_uploaded_file($file_tmp, "uploads/".$file_name);
         echo "Success";
      }else{
         print_r($errors);
      }
   }
   echo "29";
?>