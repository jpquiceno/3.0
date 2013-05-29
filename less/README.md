Do NOT publish this folder, it is only a container for the LESS documents which are compiled into the application CSS.


* http://uablogs.missouri.edu/interface/2011/12/write-less-css/
* targeting IE versions: http://goo.gl/3frZ
* http://www.greywyvern.com/code/php/binary2base64

LESS compiler will attempt to validate CSS, we need to escape this particular CSS hack (as shown) to target IE only
* border: none~'\9'; /* IE 8 or lower */

Using DATA URLs for glyphs, example:
* background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=) center right no-repeat;
* background: url(http://www.cdc.gov/TemplatePackage/images/icon_out.png) center right no-repeat~'\9';


http://csswizardry.com/2011/09/writing-efficient-css-selectors/


http://stackoverflow.com/questions/10451317/twitter-bootstrap-customization-best-practices


http://www.456bereastreet.com/archive/200601/css_3_selectors_explained/


PLEASE USE PX!

TL;DR: use px.

The Facts
First, it's extremely important to know that per spec, the CSS px unit does not equal one physical display pixel. This has always been true – even in the 1996 CSS 1 spec.

CSS defines the reference pixel, which measures the size of a pixel on a 96 dpi display. On a display that has a dpi substantially different than 96dpi (like Retina displays), the user agent rescales the px unit so that its size matches that of a reference pixel. In other words, this rescaling is exactly why 1 CSS pixel equals 2 physical Retina display pixels.

That said, up until 2010 (and the mobile zoom situation notwithstanding), the px almost always did equal one physical pixel, because all widely available displays were around 96dpi.

Sizes specified in ems are relative to the parent element. This leads to the em's "compounding problem" where nested elements get progressively larger or smaller. For example:

body { font-size:20px; } 
div { font-size:0.5em; }
Gives us:

<body> - 20px
    <div> - 10px
        <div> - 5px
            <div> - 2.5px
                <div> - 1.25px
The CSS3 rem, which is always relative only to the root html element, is too new to rely on. As of July 2012, around 75% of all browsers in use support the rem.

The Opinion
I think everyone agrees that it's good to design your pages to be accommodating to everyone, and to make consideration for the visually impaired. One such consideration (but not the only one!) is allowing users to make the text of your site bigger, so that it's easier to read.

In the beginning, the only way to provide users a way to scale text size was by using relative size units (such as ems). This is because the browser's font size menu simply changed the root font size. Thus, if you specified font sizes in px, they wouldn't scale when changing the browser's font size option.

Modern browsers (and even the not-so-modern IE7) all changed the default scaling method to simply zooming in on everything, including images and box sizes. Essentially, they make the reference pixel larger or smaller.

Yes, someone could still change their browser default stylesheet to tweak the default font size (the equivalent of the old-style font size option), but that's a very esoteric way of going about it and I'd wager nobody1 does it. (In Chrome, it's buried under the advanced settings, Web content, Font Sizes. In IE9, it's even more hidden. You have to press Alt, and go to View, Text Size.) It's much easier to just select the Zoom option in the browser's main menu (or use Ctrl++/-/mouse wheel).

1 - within statistical error, naturally

If we assume most users scale pages using the zoom option, I find relative units mostly irrelevant. It's much easier to develop your page when everything is specified in the same unit (images are all dealt with in pixels), and you don't have to worry about compounding. ("I was told there would be no math" – there's dealing with having to calculate what 1.5em actually works out to.)

One other potential problem of using only relative units for font sizes is that user-resized fonts may break assumptions your layout makes. For example, this might lead to text getting clipped or running too long. If you use absolute units, you don't have to worry about unexpected font sizes from breaking your layout.

So my answer is use pixel units.


// 4col default:
// .span12 {
//   width: 1170px;
// }
// .span11 {
//   width: 1070px;
// }
// .span10 {
//   width: 970px;
// }
// .span9 {
//   width: 870px;
// }
// .span8 {
//   width: 770px;
// }
// .span7 {
//   width: 670px;
// }
// .span6 {
//   width: 570px;
// }
// .span5 {
//   width: 470px;
// }
// .span4 {
//   width: 370px;
// }
// .span3 {
//   width: 270px;
// }
// .span2 {
//   width: 170px;
// }
// .span1 {
//   width: 70px;
// };
// 

// 3col defaults:
// .span12 {
//   width: 940px;
// }
// .span11 {
//   width: 860px;
// }
// .span10 {
//   width: 780px;
// }
// .span9 {
//   width: 700px;
// }
// .span8 {
//   width: 620px;
// }
// .span7 {
//   width: 540px;
// }
// .span6 {
//   width: 460px;
// }
// .span5 {
//   width: 380px;
// }
// .span4 {
//   width: 300px;
// }
// .span3 {
//   width: 220px;
// }
// .span2 {
//   width: 140px;
// }
// .span1 {
//   width: 60px;
// }


// 2col defaults:
// .span12 {
// width: 724px;
// }
// .span11 {
// width: 662px;
// }
// .span10 {
// width: 600px;
// }
// .span9 {
// width: 538px;
// }
// .span8 {
// width: 476px;
// }
// .span7 {
// width: 414px;
// }
// .span6 {
// width: 352px;
// }
// .span5 {
// width: 290px;
// }
// .span4 {
// width: 228px;
// }
// .span3 {
// width: 166px;
// }
// .span2 {
// width: 104px;
// }
// .span1 {
// width: 42px;
// }