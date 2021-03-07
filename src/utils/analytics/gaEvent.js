import ReactGA from "react-ga";

export default function gaEvent({
    category, // required
    action, // required
    label = "Default", // name of the the component when the ga is being called
    value,
    nonInteraction = false,
    transport, // 'beacon', 'xhr', or 'image' n1
}) {
    if (!category || !action)
        return console.log(
            "ERROR: requires category and action to run google analytics"
        );
    return ReactGA.event({
        category,
        action,
        label,
        value,
        nonInteraction,
        transport,
    });
}

/* e.g
ReactGA.event({
    // n1
    label: "Form",
    category: "cliAdmin",
    action: "Created an account",
    transport: "beacon",
});
 */

/* https://github.com/react-ga/react-ga
ReactGA.event(args)
Tracking in-page event interactions is key to understanding the use of any interactive web property. This is how we record user interactions that don't trigger a change in URL.

Examples
ReactGA.event({
  category: 'User',
  action: 'Created an Account'
});

ReactGA.event({
  category: 'Social',
  action: 'Rated an App',
  value: 3
});

ReactGA.event({
  category: 'Editing',
  action: 'Deleted Component',
  label: 'Game Widget'
});

ReactGA.event({
  category: 'Promotion',
  action: 'Displayed Promotional Widget',
  label: 'Homepage Thing',
  nonInteraction: true
});
Value   Notes
args.category   String. Required. A top level category for these events. E.g. 'User', 'Navigation', 'App Editing', etc.
args.action String. Required. A description of the behaviour. E.g. 'Clicked Delete', 'Added a component', 'Deleted account', etc.
args.label  String. Optional. More precise labelling of the related action. E.g. alongside the 'Added a component' action, we could add the name of a component as the label. E.g. 'Survey', 'Heading', 'Button', etc.
args.value  Int. Optional. A means of recording a numerical value against an event. E.g. a rating, a score, etc.
args.nonInteraction Boolean. Optional. If an event is not triggered by a user interaction, but instead by our code (e.g. on page load), it should be flagged as a nonInteraction event to avoid skewing bounce rate data.
args.transport  String. Optional. This specifies the transport mechanism with which hits will be sent. Valid values include 'beacon', 'xhr', or 'image'.
 */

/* COMMENTS
n1: about beacon (baliza, farol):
One thing to note is if your user is submitting a form you can specify the     transport: beacon property in your event hit, which will let you reliably send the hit even if the page is reloaded to another page. This isn't so much of an issue in a single page app like React, but if you did want to do this, just know this option is available
*/
