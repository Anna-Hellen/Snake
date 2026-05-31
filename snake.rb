class Snake
  attr_accessor :joints, :valid, :dir
  def initialize(dimensions)
    @dimensions = dimensions
    @joints = [[dimensions[:x] / 2, dimensions[:y] / 2]]
    @dir = "up"
    @valid = true
    # direction(@dir) can be one of "up", "down", "left" or "right"
  end

  def new_head_position
    new_head = @joints.last.clone
    if @dir == "down"
      new_head[1] = new_head[1] + 1
    elsif @dir == "up"
      new_head[1] = new_head[1] - 1
    elsif @dir == "right"
      new_head[0] = new_head[0] + 1
    else
      new_head[0] = new_head[0] - 1
    end
    new_head
  end

  def move(apple_position)
    new_head = new_head_position

    if valid_position?(new_head)
      @joints.push(new_head)

      if new_head != apple_position
        @joints.shift
      end
    else
      @valid = false
    end
  end

  def valid_position?(position)
    position[0] >= 0 && position[0] < @dimensions[:x] && position[1] >= 0 && position[1] < @dimensions[:y] && !@joints.include?(position)
  end
end

class Apple
  attr_accessor :position

  def initialize(position)
    @position = position
  end
end

class Board
  attr_accessor :is_won, :is_lost

  def initialize(dimensions)
    @dimensions = dimensions
    @snake = Snake.new(dimensions)
    @apple = Apple.new(new_apple_position)
    @is_won = false
    @is_lost = false
  end

  def move_snake
    build_board
    @snake.move(@apple.position)
    if @snake.valid
      if @snake.joints.last == @apple.position
        @apple.position = new_apple_position
      end
      if is_won?
        @is_won = true
      end
    else
      @is_lost = true
    end
  end

  def new_apple_position
    new_coordinate = random_coordinate

    while @snake.joints.include?(new_coordinate)
      new_coordinate = random_coordinate
    end

    new_coordinate
  end

  def random_coordinate
    x = rand(@dimensions[:x])
    y = rand(@dimensions[:y])

    [x, y]
  end

  def change_snake_direction(direction)
    @snake.dir = direction
  end

  def is_won?
    @snake.joints.length == @dimensions[:x] * @dimensions[:y]
  end

  def build_board
    @board = Array.new(@dimensions[:y]) { Array.new(@dimensions[:x], "_")}
    @board[@apple.position[1]][@apple.position[0]] = "@"

    @snake.joints.each do |joint|
      @board[joint[1]][joint[0]] = "*"
    end

    @board.each do |row|
      puts row.to_s
    end
    puts ""
  end
end


class Game
  def initialize(dimensions)
    @dimensions = dimensions
    @board = Board.new(@dimensions)
    @key_hash = {"w" => "up", "a" => "left", "s" => "down", "d" => "right"}
  end

  def play
    puts "Welcome to Snake!"
    while !@board.is_won && !@board.is_lost
      key = keypress?
      if key && @key_hash[key]
        @board.change_snake_direction(@key_hash[key])
      end

      @board.move_snake
      sleep 1
    end

    if @board.is_won
      puts "Congratulations, you won!"
    else
      puts "Sorry, you lost"
    end
    puts "Play again? [Y/N]"
    input = gets.chomp

    if input == "y"
      @board = Board.new(@dimensions)
      play
    else
      return
    end
  end

  def keypress?
    begin
      while c = STDIN.read_nonblock(1)
        return c
      end
      false
    rescue Errno::EINTR
      false
    rescue Errno::EAGAIN
      false
    rescue EOFError
      false
    end
  end
end

if __FILE__ == $PROGRAM_NAME
  game = Game.new({x: 10, y: 10})
  game.play
end
