call mvn compile
call mvn dependency:copy-dependencies -DoutputDirectory=src/main/webapp/WEB-INF/lib  -DincludeScope=runtime
pause