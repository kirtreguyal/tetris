function createGrid(rows, cols) {
    let multi_dimentional_array = [];

    for(let row_index = 0; row_index < rows; row_index++){
        let row = []
        for (let column_index = 0; column_index < cols; column_index++) {
            row.push(0)
        }
        multi_dimentional_array.push(row);
    }

    return multi_dimentional_array;
}

function render(mock_env, user_pos, piece){
    let response_data = { is_done: false }

    const tetris = document.getElementById('tetris');
    tetris.innerHTML = "";
    let { x, y } = user_pos;

    for(let row = 0; row < mock_env.length; row++){
        for (let column = 0; column < mock_env[row].length; column++){
            if(row === x && column === y){
                let row_test = row;
                
                for(let row_piece = 0; row_piece < piece.length; row_piece++){
                    let column_test = column;
                    for(let column_piece = 0; column_piece < piece[row_piece].length; column_piece++){
                        if(piece[row_piece][column_piece] !== 0){
                            mock_env[row_test][column_test + column_piece] = piece[row_piece][column_piece];
                        }
                        else{
                            response_data.is_done = true;
                        }
                    }

                    row_test += 1;
                }
            }   

            const grid_item = document.createElement('div');
            grid_item.classList.add('grid-item');
            grid_item.setAttribute("space", mock_env[row][column]);
            grid_item.setAttribute("row", row);
            grid_item.setAttribute("id", row + column);
            tetris.appendChild(grid_item);
        }
    }

    return { ...response_data, mock_env: mock_env };
}

addEventListener("DOMContentLoaded", async (event) => {
    const piece = [
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ];

    let piece_pos = { x: 0, y: 4 };
    let grid = createGrid(20, 10);
    
    let is_game_ongoing = 0;

    /* Create a loop that loops throughout the game */
    while(is_game_ongoing < 4){
        let interval = 500;

        await new Promise((resolve) => {
            let render_environment = setInterval(() => {
                let mock_env = JSON.parse(JSON.stringify(grid));
        
                if(piece_pos.x < grid.length - 1){
                    render(mock_env, piece_pos, piece);
                    piece_pos.x++;
                }
                else{
                    clearInterval(render_environment);
                    is_game_ongoing += 1;
                    piece_pos.x = 0;
                    resolve()
                }
            }, interval);
        })

        console.log("test");
    }
    // do{
    // } 
    // while(is_game_ongoing);

});
