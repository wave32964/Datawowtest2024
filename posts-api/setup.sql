-- Drop the blogs table if it exists
DROP TABLE IF EXISTS blogs CASCADE;

-- Create the blogs table if it doesn't exist
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100),
    avatar VARCHAR(255),
    category VARCHAR(100),
    title VARCHAR(255),
    excerpt TEXT,
    content TEXT,
    comments INTEGER DEFAULT 0,
    timeAgo VARCHAR(50)
);

-- Insert initial data into blogs table
INSERT INTO blogs (author, avatar, category, title, excerpt, content, comments, timeAgo)
VALUES
    ('Wittawat', '/placeholder.svg?height=40&width=40', 'History', 'The Beginning of the End of the World',
        'The afterlife sitcom The Good Place comes to its culmination, the show''s two protagonists, Eleanor and Chidi, contemplate their future. Having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offer...',
        'The afterlife sitcom The Good Place comes to its culmination, the show''s two protagonists, Eleanor and Chidi, contemplate their future. Having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offer, they decide it''s time to walk through the door that leads to true finality. The show''s message is that even paradise becomes meaningless without the possibility of an ending.',
        32, '5mo. ago'),

    ('Zach', '/placeholder.svg?height=40&width=40', 'History', 'The Big Short War',
        'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would''ve..."',
        'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would''ve lost it."\n\n"Admit it," his father said. "You didn''t study." "One wrong on the verbal," Wes said. "One wrong on the math," Tim mused. "I''m still convinced some of the questions were wrong."',
        32, '5mo. ago'),

    ('Nicholas', '/placeholder.svg?height=40&width=40', 'Exercise', 'The Mental Health Benefits of Exercise',
        'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?',
        'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?\n\nResearch shows that exercise is as effective as antidepressants in some cases and that maintaining an exercise schedule can prevent you from relapsing. Exercise is a powerful tool for people with depression, ADHD, anxiety, and more. It promotes all kinds of changes in the brain, including neural growth, reduced inflammation, and new activity patterns that promote feelings of calm and well-being.',
        32, '3mo. ago'),

    ('Carl', '/placeholder.svg?height=40&width=40', 'History', 'What Makes a Man Betray His Country?',
        'The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage',
        'The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage.\n\nIn 1977, Adolf Tolkachev, a Russian engineer who worked in a military aviation institute, began passing secrets to the CIA about Soviet radar and avionics systems. His espionage career lasted nearly a decade and provided the United States with information that saved billions in defense spending. What drove him to betray his country? Not money, though the CIA paid him millions of rubles. It was revenge: The Soviet system had destroyed his wife''s parents during Stalin''s Great Terror.',
        0, '2mo. ago');

-- Drop the comments table if it exists
DROP TABLE IF EXISTS comments CASCADE;

-- Create the comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    author VARCHAR(100),
    avatar VARCHAR(255),
    content TEXT,
    timeAgo VARCHAR(50)
);

-- Insert sample comments into the comments table
INSERT INTO comments (blog_id, author, avatar, content, timeAgo)
VALUES
    (1, 'Wittawat98', '/placeholder.svg?height=32&width=32', 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.', '12h ago'),
    (1, 'Hawaii51', '/placeholder.svg?height=32&width=32', 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.', '1mo. ago'),
    (1, 'Helo_re', '/placeholder.svg?height=32&width=32', 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet.', '3mo. ago');
