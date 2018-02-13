# HCINPCC Unit Website Development

View it at https://czx123.github.io

## IMPORTANT

Do not copy the README.md and robots.txt files to the official unit website GitHub repository!
Here's why:
The README.md file is the description of the repository which is also what you are looking at right now. We do not want this description to appear in the official repository.
The robots.txt file here prevents any search engine bots like Google and Bing to crawl this site. This is necessary for here since we do not want this development website to appear on Google, but we want the official one to! So don't copy the file to the official one! If you do, then revert the files back to the previous versions.

## Instructions

1. Always sync first before editing these files, to ensure you have the latest files first before changing them.
2. When adding any new, unintroduced components, try to keep to the current design and do not allow any new design elements that are out of place.

## Design

- Material Design
  - Theme color: `#3F51B5`
  - More values can be accessed here: https://material-components-web.appspot.com/
- No dividers or borders at all. Make use of whitespace or coloured backgrounds to structure or separate information
- Ripple effects by default would work on all `<button>` elements. Simply make sure that all elements in the button are all `display: block;`, and the ripple should work just fine.
- Make use of shadows and hover effects for interactive elements like buttons and links. Do not use a hover effect if the element itself does nothing on click.

## Others

The `officers.html` page is interesting, as it uses base64 encryption + a 5-character salt at the start in each `href` attribute of each officer. This is to prevent bot spamming by hiding the email addresses and decrypting the encrypted code when the actual page loads, using JavaScript.
