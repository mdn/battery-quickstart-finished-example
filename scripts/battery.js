// fork the navigator.battery object depending on what prefix the viewing browser uses
var battery = navigator.battery || navigator.mozBattery || navigator.webkitBattery;

// grab the elements we need, and put them in variables
var indicator1 = document.getElementById('indicator1');
var indicator2 = document.getElementById('indicator2');
var batteryCharge = document.getElementById('battery-charge');
var batteryTop = document.getElementById('battery-top');
var chargeIcon = document.getElementById('battery-charging');

// Flag to check if battery charged/not charged has already been notified once
// 0 for first time of notification, 1 means "charged" has already been notified,
// 1 means "not charged" has already been notified
// This is set to the opposite after each notification, so that you don't keep
// getting repeat notifications about the same charge state.
var chargingState = 0;

function updateBatteryStatus() {
  // battery.level can be used to give us a percentage of bettery charge to report to 
  // the app's user
  var percentage = Math.round(battery.level * 100);
  indicator1.innerHTML = "Battery charge at " + percentage + "%";
  batteryCharge.style.width = percentage + '%';
  
  if(percentage >= 99) {
    // report that the battery is fully charged, more or less ;-)
    batteryTop.style.backgroundColor = 'limegreen';
    batteryCharge.style.backgroundColor = 'limegreen';

    createNotification("Device battery fully charged.");
  }
  
  if(battery.charging) {
  // If the battery is charging  
    if(chargingState == 1 || chargingState == 0) {
    // and if our chargingState flag is equal to 0 or 1

      // alter the styling to show the battery charging
      batteryTop.style.backgroundColor = 'gold';
      batteryCharge.style.backgroundColor = 'gold';
      indicator2.innerHTML = "Battery is charging"; 
      chargeIcon.style.visibility = 'visible';

      // notify the user with a custom notification
      createNotification("Device battery now charging.");
      
      // flip the chargingState flag to 2 
      chargingState = 2;
    }
  } else if(!battery.charging) {
  // If the battery is NOT charging
    if(chargingState == 2 || chargingState == 0) {
    // and if our chargingState flag is equal to 0 or 2

      // alter the styling to show the battery NOT charging
      batteryTop.style.backgroundColor = '#eee';
      batteryCharge.style.backgroundColor = '#eee';
      indicator2.innerHTML = "Battery not charging";
      chargeIcon.style.visibility = 'hidden';

      // notify the user with a custom notification
      createNotification("Device battery is not charging.");
      
      // flip the chargingState flag to 1
      chargingState = 1;
    }
  }
}

function createNotification(message) {

  // Let's check if the browser supports notifications
  if (!"Notification" in window) {
    console.log("This browser does not support notifications.");
  }

  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    
    // show the notification  
    var notification = new Notification('Battery status', { body: message });

    // And vibrate the device if it supports vibration API
    window.navigator.vibrate(500);
  }

  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {

      // Whatever the user answers, we make sure Chrome stores the information
      if(!('permission' in Notification)) {
        Notification.permission = permission;
      }

      // If the user is okay, let's create a notification
      if (permission === "granted") {
        
        // show the notification
        var notification = new Notification('Battery status', { body: message });

        // And vibrate the device if it supports vibration API
        window.navigator.vibrate(500);
      }
    });
  }
}

// Event handler to check whether the battery has started charging or stopped charging
battery.addEventListener("chargingchange", updateBatteryStatus, false);
// Event handler to check whether the battery charge level has changed
battery.addEventListener("levelchange", updateBatteryStatus, false);

// run the central function once when the app is first loaded
updateBatteryStatus();