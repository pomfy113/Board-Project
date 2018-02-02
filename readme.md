#(Placeholder Name)
The current idea in progress is a 3-dimensional board that people can use for various tabletop games. I took my inspiration from old-school isometric tactical games, such as X-com and Final Fantasy Tactics.

The end product will hopefully allow people to have a more immersive experience with tier tabletop games, whatever it may be!

## Tech
Node.js and Express.
Vanilla Javascript and CSS! No libraries.

## Gameplan
1. [X] Create workable grid.
    * [X] Decide on how to make grid
    * [X] Allow creation of different grid sizes
    * [X] Allow tracking of cell grids
2. [X] Create a draggable object
     * [X] Have it work with grid (may have to redo 1)
     * [X] Able to drag it from container to grid cell
     * [X] Able to create extra instances
     * [X] Able to drag it from grid cell to another cell
3. [ ] Visual effects/Adjusting
     * [X] Able to rotate grid
     * [X] Able to create different height (true 3D)
     * [ ] Object generator rather than creating THEN dragging **(IN PROGRESS)**
     * [ ] Basic adjusting of where the grid is (center it) **(IN PROGRESS)**
4. [ ] Basic clean-up
     * [ ] Improve and clean-up basic javascript **(IN PROGRESS)**
5. [ ] Tokens
     * [ ] Create tokens
     * [ ] Able to upload images for tokens
     * [ ] Multi-face tokens?
6. [ ] Socket
     * [ ] Implement Socket.io?
