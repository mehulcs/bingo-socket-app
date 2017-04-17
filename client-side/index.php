<html>
    
        <head>
            <script src="socket.io.js"></script>
            <script src="https://www.w3schools.com/lib/w3data.js"></script>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="style.css">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </head>
        <style>
            table,td{
                border: 2px solid green;
                text-align: center;
            }
            td{
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            table{
                border-collapse: collapse;
                width:100%;
                height: 300px;
                max-width: 500px;

                margin:2px;
                margin-top:10px;
            }
            .playagain{
                margin-left:5px;
            }
        </style>
        <body>
        <?php 
            // if(isset($_POST["submit"])){
            //     $name=$_POST['name'];
            // }
        ?>
        <?php // if($name != 'mehul' && !isset($_POST['showbox'])){ ?>
            <!--<div class="col-xs-12 col-sm-offset-4 col-sm-4" style="margin-top: 25px;">
                <form  id="form" method="POST" action="<?php //echo $_SERVER["PHP_SELF"]; ?>">
                    <input  class="form-control" type="text" name="name" id="name" placeholder="Enter your name">
                    <br>
                    <input class="btn btn-primary" type="submit" name="submit" value="login">
                </form>    
            </div>            -->
        <?php //} else { ?>
            <div class="col-xs-12 col-sm-offset-4 col-sm-4" style="margin-top: 25px;">
                <form method="POST">
                    <input class="form-control" type="number" name="room" placeholder="Ex:1233" id="input_room">
                    <br>
                    <input class="btn btn-default" type="button" onclick="joinroom()" name="showbox" value="Join Room">
                    <br><br>
                    <input class="btn btn-default" type="button" onclick="createroom()" name="showbox" value="Create room">
                </form>
            </div>
        <?php //} ?>
    </body>
    <script src="script.js"></script>
</html>
