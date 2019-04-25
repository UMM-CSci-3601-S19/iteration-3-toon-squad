# Known Issues

The deployment of Toon-Squad's product from iteration 3 was not without issues, some of them were fairly major. Many of them were revealed
during the showcase. Those who are going to use this code base, whether as a whole or only in parts, could benefit from reading this 
document. I've outlined the issues, as well as some possible solutions to them (if I have any in midn). I've also used my best judgement 
to organize these into two categories: 'major' and 'minor' issues. 

## Major Issues

### 1) Ride allow people to join beyond the point of seatsAvailable = 0

#### Explanation: 
Rides restrict people from joining them when the ride seats are equal to 0. However, this is only checked on the client side.
If two people are browsing the app, and both want to join a ride with 1 seat available, it's possible that they both can join. This happens
because the only thing stopping the second person from joining the ride is the seatsAvailable variable ON THE CLIENT SIDE. If person A joins
and person B tries to join the same ride (before refreshing the page), they will make onboard. This results in the ride card displaying
negative seats available, and too many passengers on board.

#### Solution: 
When someone joins a ride, this should also be checked at the database (it doesn't do that right now). If person A joins, then
the ride object then has 0 seats available. If person B joins right after them, before reloading the page to  display the new seatsAvailable,
the app should let them push button. However, the ride controller should stop them actually joining when by checking the ride to see that
there no seats left, and possibly send back a message that tells them that the ride filled up before they pressed the button.

### 2) Datepicker gets cutoff by bottom of screen on mobile

#### Explanation: 
(On mobile) When picking a departure date for a ride, the bottom of the date picker gets cut off at the bottom.
This prevents people from picking dates that occur in the last 1-2 weeks of the calender.

#### Solution:
Possibly some settings on the datepicker itself that alters how it pops up. I know that Angular has a setting for this on the 'dot-menu'
that lets it appear above, below, before, and after the button. 

Here's a link that explains: https://material.angular.io/components/menu/overview

### 3) Keyboarding switching when entering phone number on mobile

#### Explanation:
Nic showed me the problem on his mobile device (I suspect this is relative to only certain keyboard applications, as I cannot reproduce
the problem on mine). The problem is that when entering your phone number on the profile, the keyboard will switch modes after entering
a digit. The keyboard will switch from the digit display, to a letter display after each digit entered (hard to explain, feel free to
ask me or Nic). This only occurs for the first 4 digits.

#### Solution:
Not sure, though I *suspect* it is related to how the input field automatically formats the area code with paranthesis, and that when
the digit you are entering is adjacent to those paranthesis, certain keyboards will switch (the 4th digit will be the last one adjacent
to the area code).

### 4) Multiple security issues

#### Explanation:
People can essentially spoof other users and create rides on their behalf. People can also create fake users by manually entering
a request that follows the rules that what that request should look like. Google authentication is not quite secure yet. There are
some api endpoints that are not protected by the route guard (I believe /rides is one of them). There are also some print statements
that reveal a TON of information in the browser console.

#### Solution:
The first three problems are related and a bit difficult to fix, and I confess that I don't know the best solution. This is being investigate by the
security team for iteration 4. A possible way would be check that user making the request actually matches up with the user/ride that
they are making the request for and restrict them if it doesn't match. This is tricky. 

Concerning the route guarder, simply adding that api call to the code should protect it. Finally, the print statements need to be found
and erased before deployment.


## Minor Issues:

### 1) Radio buttons cannot be unselected on ride-list

#### Explanation:
The radio buttons allow for automatic filtering between offered and requested rides on the ride list. The default setting is that neither
button is checked, and this means both requested AND offered rides are displayed. Pushing either button will show the rides that
correspond to that button. However, these buttons cannot be unselected, so the user must refresh the page to see both offered and
requested rides again.

#### Solution:
Not sure about this one either, though I suspect it is related to the settings of Angular's radio module. Some digging may be required 
to figure out the problem. An alternative solution that has used by other groups is to have a third radio button that allows for both
requested and offered rides to be displayed. A third option would be to implement checkboxes, since these can easily be unchecked.

### 2) Rides on PROFILE page show to opposite for nonSmoking

#### Explanation:
For listed rides on the profile page, the description shows the nonSmoking status of the ride. However, it shows the opposite of what it
should be.

#### Solution:
Find out where the boolean is wrong, and switch it. Probably in the profile component HTML.

### 3) Profile only shows rides the user has created, but not rides they've joined

#### Explanation:
It was suggested that showing ALL rides that the user was associated with would be most helpful.

#### Solution:
Make the profile display those rides. I'm not sure how the profile finds the user's created rides, but I suspect it happens near the
database. Changing it to check for the joined rides should be analagous to checking for the user's created rides.
