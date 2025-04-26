# TripBuddy


How to deploy? 
 - Enter the VM using ssh
 - Go into the TripBuddy folder
 - In the terminal run: 
 ```
 sudo su
 ./deploy.sh
 ```

#Husky
Now on every commit, the entire project will be linted. (and tests will run)
If you wish to disable this behaviour just comment out the contents of .husky/pre-commit