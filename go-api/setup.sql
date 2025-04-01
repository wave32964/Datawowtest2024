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
    ('Wittawat', '/placeholder.svg?height=40&width=40', 'Food', 'The Beginning of the End of the World',
        'The afterlife sitcom The Good Place comes to its culmination, the show''s two protagonists, Eleanor and Chidi, contemplate their future. Having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offer...',
        'The afterlife sitcom The Good Place comes to its culmination, the show''s two protagonists, Eleanor and Chidi, contemplate their future. Having lived thousands upon thousands of lifetimes together, and having experienced virtually everything this life has to offer, they decide it''s time to walk through the door that leads to true finality. The show''s message is that even paradise becomes meaningless without the possibility of an ending.',
        4, '5mo. ago'),

    ('Zach', '/placeholder.svg?height=40&width=40', 'Pet', 'The Big Short War',
        'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would''ve..."',
        'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. "I would''ve lost it."\n\n"Admit it," his father said. "You didn''t study." "One wrong on the verbal," Wes said. "One wrong on the math," Tim mused. "I''m still convinced some of the questions were wrong."',
        4, '5mo. ago'),

    ('Nicholas', '/placeholder.svg?height=40&width=40', 'Health', 'The Mental Health Benefits of Exercise',
        'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?',
        'You already know that exercise is good for your body. But did you know it can also boost your mood, improve your sleep, and help you deal with depression, anxiety, stress, and more?\n\nResearch shows that exercise is as effective as antidepressants in some cases and that maintaining an exercise schedule can prevent you from relapsing. Exercise is a powerful tool for people with depression, ADHD, anxiety, and more. It promotes all kinds of changes in the brain, including neural growth, reduced inflammation, and new activity patterns that promote feelings of calm and well-being.',
        4, '3mo. ago'),

    ('Carl', '/placeholder.svg?height=40&width=40', 'History', 'What Makes a Man Betray His Country?',
        'The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage',
        'The life of Adolf Tolkachev, Soviet dissident and CIA spy. Excerpted from The Billion Dollar Spy: A True Story of Cold War Espionage.\n\nIn 1977, Adolf Tolkachev, a Russian engineer who worked in a military aviation institute, began passing secrets to the CIA about Soviet radar and avionics systems. His espionage career lasted nearly a decade and provided the United States with information that saved billions in defense spending. What drove him to betray his country? Not money, though the CIA paid him millions of rubles. It was revenge: The Soviet system had destroyed his wife''s parents during Stalin''s Great Terror.',
        4, '2mo. ago');

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
-- Insert sample comments into the comments table
INSERT INTO comments (blog_id, author, avatar, content, timeAgo)
VALUES
    (1, 'Wittawat98', '/placeholder.svg?height=32&width=32', 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.', '12h ago'),
    (1, 'Hawaii51', '/placeholder.svg?height=32&width=32', 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.', '1mo. ago'),
    (1, 'Helo_re', '/placeholder.svg?height=32&width=32', 'Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio lacuis sed aliquet.', '3mo. ago'),

    (2, 'Jake30', '/placeholder.svg?height=32&width=32', 'Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. I would''ve lost it...', '1mo. ago'),
    (2, 'PetLover', '/placeholder.svg?height=32&width=32', 'I can relate! It''s crazy how moments like these shape our futures and decisions. Great post, really made me think!', '2w ago'),
    (2, 'MarcusW', '/placeholder.svg?height=32&width=32', 'Wow, this brings back memories of my own high school experiences. Sometimes, those small decisions lead to big changes in life.', '3w ago'),

    (3, 'NinaBlue', '/placeholder.svg?height=32&width=32', 'Exercise is truly a game changer! It helped me with my mental health when I was feeling stressed and anxious. Highly recommend it to anyone!', '3d ago'),
    (3, 'AnnaP', '/placeholder.svg?height=32&width=32', 'Absolutely! Exercise is amazing for both physical and mental well-being. I love the fact that research shows how it can help with depression and anxiety.', '1mo. ago'),
    (3, 'JohnDoe', '/placeholder.svg?height=32&width=32', 'I had no idea exercise was that effective for mental health! Great read, will definitely look into incorporating more exercise into my routine.', '2w ago'),

    (4, 'ColdWarFan', '/placeholder.svg?height=32&width=32', 'What an amazing story about Tolkachev! His bravery and commitment to espionage for the sake of his beliefs are mind-blowing. I had never heard of this before.', '1w ago'),
    (4, 'HistoryBuff', '/placeholder.svg?height=32&width=32', 'This was such a fascinating read! Espionage during the Cold War is such a compelling topic. I can''t imagine the kind of risk he took every day.', '2mo. ago'),
    (4, 'SpyMaster', '/placeholder.svg?height=32&width=32', 'Tolkachev’s story is incredible. It’s amazing how someone can give up so much for a cause. It really gives you insight into the personal toll of such decisions.', '4w ago'),

    -- Add more comments for additional blogs (if needed)
    (1, 'UserComment', '/placeholder.svg?height=32&width=32', 'Interesting perspective on the afterlife. I always wondered about the implications of living forever in the same place. Very thought-provoking!', '1w ago'),
    (2, 'SatBetWin', '/placeholder.svg?height=32&width=32', 'Incredible story about the SAT, I can totally relate. Sometimes a single decision changes the course of everything.', '2d ago'),
    (3, 'FitLife', '/placeholder.svg?height=32&width=32', 'I completely agree! Exercise has been my remedy for mental health too. It should be recommended more in therapy!', '5d ago');


UPDATE blogs
SET comments = (
    SELECT COUNT(*)
    FROM comments
    WHERE comments.blog_id = blogs.id
);
