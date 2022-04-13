# Test Markdown File

*Author Name*  

## L2 Title

[Lorem ipsum](https://www.lipsum.com/feed/html) dolor sit amet, consectetur adipiscing elit. Mauris vel sollicitudin mauris, eu suscipit tellus. Proin id euismod metus. Donec at bibendum enim, eu egestas nulla. Donec sollicitudin accumsan rhoncus. Nunc ipsum libero, facilisis at laoreet in, porttitor vitae tellus. **Nullam sit amet diam sit amet magna blandit suscipit.** Aliquam eu tortor non libero tincidunt interdum a vel ipsum. Etiam sagittis metus eu sem cursus elementum. Mauris luctus quam magna, a fringilla magna convallis at. Donec nec neque faucibus, laoreet ante at, aliquam tortor.

## L2 Title

### Words and List

Donec sed justo non est iaculis iaculis sed sit amet eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin et lacus a odio pulvinar pulvinar vitae eget eros. Vestibulum blandit hendrerit tellus, et pulvinar odio vestibulum sit amet. Ut pulvinar tortor dolor, nec cursus risus fermentum sit amet. In hac habitasse platea dictumst. Ut sagittis ligula vel felis venenatis iaculis. Nulla faucibus varius accumsan. Nullam luctus dolor purus, vel euismod elit efficitur eget.

Unordered List:
- Something 1
- Something 2
- Something 3

Ordered List:
1. Something 1
2. Something 2
3. Something 3


### Code Block
```javascript
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```
