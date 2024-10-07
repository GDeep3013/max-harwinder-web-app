<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Product Search</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
         var Config={
            user:<?php echo Auth::user() ? Auth::user() : 'null' ?>,
        };
    </script>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>

<body>
    <div id="root">
    </div>
</body>
</html>