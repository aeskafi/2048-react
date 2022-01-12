# 2048-react

This is a clone of [2048](http://gabrielecirulli.github.io/2048/) implemented using React. It's running live [here]().

The game logic is implemented in [./src/components/mainBoard.jsx](). It was much cleaner at first, but in order to get movement animations, a lot of state needs to be saved for each of the tiles on the board.

### React

The view logic is in [./src/index.js](). There is one main component called [MainBoard]() which keeps a Board object as its state. It handles all the events by forwarding them to the Board appropriately, and then propagates the changes to its child components. As promised by React, there is almost no direct DOM manipulation - except for attaching the keyDown listener to `window` so the events can be handled on the whole page instead of only when the board is focused.

The [Cell]() is used only for the lighter grey background when there is no tile on a given position.

The [TileView]() is where most of the fun view stuff happens. It receives a [Tile]() in its props object and determines whether it is new or moving, and if it's moving - what are the source and the destination. Then it sets the appropriate CSS classes in order to trigger the correct animations.

### CSS Animations

The animations are implemented in CSS3. Since there is a separate class for each movement from cell A to cell B, those classes cannot be written directly in CSS (or, at least, it would be really suboptimal) and have to be generated. [./src/styles/style.css]().

One optimization used to minimize the generated CSS size was to separate the tile movement into row and column movement. That is, instead of generating a separate animation for each quadruple `(startRow, startColumn)` -> `(endRow, endColumn)` (as can be seen [here]()), the observation is made that every movement is either completely horizontal or completely vertical. This means that there can be 2\*4^2 animations of the form `(startRow)` -> `(endRow)` and `(startColumn)` -> `(endColumn)` instead of 4^4 animations of the other form. This decreased the generated CSS size from about 70KB to about 10KB.

## Building and running

To run, simply start a you can use the React standard command.

    npm run start
