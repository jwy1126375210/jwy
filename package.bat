echo mvn package start...
call mvn clean package -Dmaven.test.skip=true
echo mvn package end...
copy .\target\jwy.war .\jwy.war
echo bingo!!
pause;