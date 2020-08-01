# Brewery Finder

## Description

Connects you to local breweries, making it easy to drink new, fresh, delicious beers without a trip to the bar or bottle shop.

## User Story

As a beer drinker, I want to :
Keep drinking beer and discovering breweries, despite Covid.
Figure out which breweries are open, and what purchase options they offer.
Direct my limited funds to the best/most-deserving breweries in my area.
Do this easily, from home.

## Wireframe/Sketch

User is greeted at the homescreen with the app logo and a search field asking for the user's zipcode/city, saying "find local breweries near me." Once the user presses search, they are taken to a screen showing listed search results; 10 breweries near them. Each one will include the brewery's logo/picture, their distance (in miles) from the user, and their rating out of 5 stars. Once the user selects a brewery, they are taken to a screen displaying more details about the brewery: full address, contact info, whether or not they deliver, and their pin on a map.

![Image of Homescreen] [https://files.slack.com/files-pri/T0110UZEFEX-F017G0ZS869/screen_shot_2020-07-21_at_8.13.37_pm.png](https://files.slack.com/files-pri/T0110UZEFEX-F017G0ZS869/screen_shot_2020-07-21_at_8.13.37_pm.png)

![Image of Results Screen][https://files.slack.com/files-pri/T0110UZEFEX-F017W1DPM5X/screen_shot_2020-07-21_at_8.32.30_pm.png] (https://files.slack.com/files-pri/T0110UZEFEX-F017W1DPM5X/screen_shot_2020-07-21_at_8.32.30_pm.png)

## APIs Used

1) Google Places API: [https://developers.google.com/places/web-service/overview](https://developers.google.com/places/web-service/overview)
2) Google Maps API: [https://developers.google.com/maps/documentation] (https://developers.google.com/maps/documentation)
3) Yelp Fusion API: [https://www.yelp.com/fusion](https://www.yelp.com/fusion)

## Team

Front End:
Cheyenne, Erin and Aiya.

Back End:
Max, Nicholas and Pratyusha.

## 'Installation'

The website is currently hosted at [https://mavn2.github.io/projectone/](https://mavn2.github.io/projectone/).

## Instructions for Use

On the home screen, enter your desired search query. The use of Google places allows the application to be very flexible: Seattle, 98103, and Wallingford Seattle all provided relevant results to me.

On the results screen, click a brewery's list entry to open a window with more detailed info. Click on a map icon to see which brewery it represents.

Click on the link in the details panel to open a brewery's Yelp page in a new tab.

The most recent search is saved in local storage and displayed on refresh. Press the home button at the top of the page to reset the application.

## Testing

The webpage is fully responsive, and we invite you to try resizing your browser!

## Planned Improvements

The app's location and directions services can be improved, either through continued work with Google's API or potentially through the use of a lighter-weight, freely available geolocation API.

The Untappd API will be integrated in the results page, providing beer enthusiasts with information (such as a detailed beer list) that Yelp does not offer.

Information about, and links to, a brewery's pandemic sales plan could be provided directly to the user, although implementing this remains a long term goal.

## License

MIT License

Copyright (c) [2020] [Team ?????]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
