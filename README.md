# HCINPCC Unit Website Development

View it at https://czx123.github.io

### Instructions

1. Always sync first before editing these files, to ensure you have the latest files first before changing them.
2. When adding any new, unintroduced components, try to keep to the current design and do not allow any new design elements that are out of place.

### Design

- Material Design
  - Theme color: #3F51B5
  - More values can be accessed here: https://material-components-web.appspot.com/
- No dividers or borders at all. Make use of whitespace or coloured backgrounds to structure or separate information
- Ripple effects by default would work on all `<button>` elements. Simply make sure that all elements in the button are all `display: block;`, and the ripple should work just fine.
- Make use of shadows and hover effects for interactive elements like buttons and links. Do not use a hover effect if the element itself does nothing on click.

### Others

The 'officers.html' page is interesting, as it uses base64 encryption + a 5-character salt at the start in each `href` attribute of each officer. This is to pevent bot spamming by hiding the email addresses and derypting the encryted code when the actual page loads, using JavaScript.
