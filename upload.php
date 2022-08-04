<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <form action="" method="post" enctype="multipart/form-data">
      <label for="file">Filename:</label>
      <input type="file" name="file" id="file" />
      <br />
      <input type="submit" name="submit" value="Submit" />
    </form>
  </body>
</html>

<?php
if(isset($_POST['submit']) && !empty($_FILES["file"]["name"])) {
$timestamp = time();
$target = "upload/";
$target = $target . basename($_FILES['uploaded']['name']) ;
$ok=1;

$allowed_types = array("image/gif","image/jpeg","image/pjpeg","image/png","image/bmp");
$allowed_extensions = array("gif","png","jpg","bmp");

if ($_FILES['file']['size'] > 350000) {
$max_size =  round(350000 / 1024);
echo "Your file is too large. Maximum $max_size Kb is allowed. <br>";
$ok=0;
}

if ($_FILES["file"]["error"] > 0) {
echo "Error: " . $_FILES["file"]["error"] . "<br />";
$ok=0;
} else {

$path_parts = pathinfo(strtolower($_FILES["file"]["name"]));

if(in_array($_FILES["file"]["type"],$allowed_types) && in_array($path_parts["extension"],$allowed_extensions)){
$filename = $timestamp."-".$_FILES["file"]["name"];
  echo "Name: " . $filename . "<br />";
  echo "Type: " . $_FILES["file"]["type"] . "<br />";
  $path_parts = pathinfo($_FILES["file"]["name"]);
  echo "Extension: " . $path_parts["extension"] . "<br />";
  echo "Size: " . round($_FILES["file"]["size"] / 1024) . " Kb<br />";
  //echo "Stored in: " . $_FILES["file"]["tmp_name"]. " <br />";
  } else {
  echo "Type " . $_FILES["file"]["type"] . "  with extension " . $path_parts["extension"] . " not allowed <br />";
  $ok=0;
  }
}
if($ok == 1){
@move_uploaded_file($_FILES["file"]["tmp_name"], $target . $filename);
$file_location = $target . $filename;
if(file_exists($file_location)){
echo "Uploaded to <a href='$file_location'>$filename</a> <br />";
} else {
echo "There was a problem saving the file. <br />";
}

}
} else {
echo "Select your file to upload.";
}

?>
