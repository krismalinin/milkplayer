var player = document.getElementById("audio");
            
            var volumeControl = document.getElementById("change_vol");
            
            var bar = document.getElementById("progbar");
            var progbar = document.getElementById("progbar").value;
            
            function play_aud() {
                player.play();
                document.querySelector('h1').style.display = "block";
            }
            
            function pause_aud() {
                player.pause();
                document.querySelector('h1').style.display = "none";
            }
            
            function stop_aud() {
                player.pause();
                player.currentTime = 0;
                document.querySelector('h1').style.display = "none";
            }
            
            var change_vol = function() {
                player.volume = this.value / 100;
            };
            
            volumeControl.addEventListener('change',change_vol);
            volumeControl.addEventListener('input',change_vol);
            
            player.addEventListener('loadedmetadata', function() {
                var duration = player.duration;
                var currentTime = player.currentTime;
                document.getElementById("duration").innerHTML = convertElapsedTime(duration);
                document.getElementById("current-time").innerHTML = convertElapsedTime(currentTime);
            });
            
            
            function convertElapsedTime(inputSeconds) {
                var seconds = Math.floor(inputSeconds % 60);
                if (seconds < 10) {
                    seconds = "0" + seconds
                }
                var minutes = Math.floor(inputSeconds / 60);
                return minutes + ":" + seconds
            };
            
            function updateBar() {
                var currentTime = player.currentTime;
                var duration = player.duration;
                
                
                document.getElementById("current-time").innerHTML = convertElapsedTime(currentTime);
                
                bar.value = 100 * (player.currentTime / player.duration)
            };
            