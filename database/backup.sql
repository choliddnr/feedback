--
-- File generated with SQLiteStudio v3.4.17 on Tue Jul 1 14:20:16 2025
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: __drizzle_migrations
CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id         SERIAL  PRIMARY KEY,
    hash       TEXT    NOT NULL,
    created_at NUMERIC
);

INSERT INTO __drizzle_migrations (
                                     id,
                                     hash,
                                     created_at
                                 )
                                 VALUES (
                                     NULL,
                                     '6728ea7a53289a2dbb2a1e1603e9343f5c41db18cdbd971793cdd8865ce45c5d',
                                     1747930604635
                                 );


-- Table: account
CREATE TABLE IF NOT EXISTS account (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT
                                     NOT NULL,
    account_id               INTEGER NOT NULL,
    provider_id              INTEGER NOT NULL,
    user_id                  INTEGER NOT NULL,
    access_token             TEXT,
    refresh_token            TEXT,
    id_token                 TEXT,
    access_token_expires_at  INTEGER,
    refresh_token_expires_at INTEGER,
    scope                    TEXT,
    password                 TEXT,
    created_at               INTEGER NOT NULL,
    updated_at               INTEGER NOT NULL,
    FOREIGN KEY (
        user_id
    )
    REFERENCES user (id) ON UPDATE NO ACTION
                         ON DELETE CASCADE
);

INSERT INTO account (
                        id,
                        account_id,
                        provider_id,
                        user_id,
                        access_token,
                        refresh_token,
                        id_token,
                        access_token_expires_at,
                        refresh_token_expires_at,
                        scope,
                        password,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        12,
                        112750229045194686464.0,
                        'google',
                        12,
                        'ya29.a0AW4Xtxjpn00B9SRKeARUATbFNSNRIfg8SOii785p0zHiPKPdbul_mZi3NKRa2Ym_f3rpsKUu7ZoNkUcdPhiLxe_73us4jSnuL4qTvIr33SR0nKMFzkHjH3SrrQXq6ZHLYQLL9JRptN3QL5JneImog8Q_d56pz4SjzGVs4-g6JQgaCgYKAW4SARMSFQHGX2MiRzTonIJP8L5hf4xDMGsNEg0178',
                        NULL,
                        'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJiNDM0Njk1OTQ0NTE4MjAxNDhiMzM5YzU4OGFlZGUzMDUxMDM5MTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNzE1NTAyODY0NjQtOWZkanFtbGk0c2JyNWp2YjhrYTBncWxjbTE2a2Q4amUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNzE1NTAyODY0NjQtOWZkanFtbGk0c2JyNWp2YjhrYTBncWxjbTE2a2Q4amUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI3NTAyMjkwNDUxOTQ2OTE4NjUiLCJlbWFpbCI6ImNob2xpZC5kbnJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJRaUNqemlWMjd6ZmE3Skd0T2dWb2tRIiwibmFtZSI6Ik0uQ2hvbGlkIERpbiBOdXIgUmFobWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xZMmJ6T2FHaGx6cTFOalk2UnIwV04zLXU3NnJyZ3dMbzRMclhOWXo4Y3FQUWRuZklmPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik0uQ2hvbGlkIiwiZmFtaWx5X25hbWUiOiJEaW4gTnVyIFJhaG1hbiIsImlhdCI6MTc0OTU0NzMyOCwiZXhwIjoxNzQ5NTUwOTI4fQ.d0GBrZf1BEe0BSFW3CeWWxipkO5xF0IkDfoVthUARi6Vb6hvH5U7f00-gn1cAR7QQ8yyv-b0iPPKR9M6Uj3hD95ifEupDWqNNQ5kJWNmXyCLWH2pqv3M5zhonOfU5E13-1YipY1ZYqAwSpItR3pNTLlKvazR1fqzLNlxSGKloy6OlJ3Jay0dEleyNX6ZuykD8e_V5Bcs_VYmjhpZTvR7r7OPe6lfDN-ykVc1ClZKGDmjt2B1ryfvrC18bglHopPnzHTaAMzwiLUfF5wB-ZHyolOY1d-uG__A56EuEmLHg04e0PsWawP5rioWKS1MMKoavGdFa9ZqvZyceWtoBjuTxA',
                        1749550926,
                        NULL,
                        'https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid',
                        NULL,
                        1749475189,
                        1749475189
                    );

INSERT INTO account (
                        id,
                        account_id,
                        provider_id,
                        user_id,
                        access_token,
                        refresh_token,
                        id_token,
                        access_token_expires_at,
                        refresh_token_expires_at,
                        scope,
                        password,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        13,
                        112750229045194686464.0,
                        'google',
                        12,
                        'ya29.a0AS3H6NwD_VmgzkxwlCrQH1xeW-TDWX4G3yCk9RrulrEYOZU4iRHKYnlepKgq43ixRB22qpZmQm8cTUml9mfRBGanRYo1qsBDgYWLoeqK_mecxcPi0gxcZNhGsszHL3wmCxHk56zobZrEoSXV1ELlJWdF8LIf9i86SAg-YdmAaCgYKAWUSARMSFQHGX2Mitwd7cp43oqQI5uNXRiFD4A0175',
                        NULL,
                        'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg4MjUwM2E1ZmQ1NmU5ZjczNGRmYmE1YzUwZDdiZjQ4ZGIyODRhZTkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNzE1NTAyODY0NjQtOWZkanFtbGk0c2JyNWp2YjhrYTBncWxjbTE2a2Q4amUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNzE1NTAyODY0NjQtOWZkanFtbGk0c2JyNWp2YjhrYTBncWxjbTE2a2Q4amUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTI3NTAyMjkwNDUxOTQ2OTE4NjUiLCJlbWFpbCI6ImNob2xpZC5kbnJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJJekoxSnRGZ0Ftb1dkcTZuRm41SkxnIiwibmFtZSI6Ik0uQ2hvbGlkIERpbiBOdXIgUmFobWFuIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xZMmJ6T2FHaGx6cTFOalk2UnIwV04zLXU3NnJyZ3dMbzRMclhOWXo4Y3FQUWRuZklmPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik0uQ2hvbGlkIiwiZmFtaWx5X25hbWUiOiJEaW4gTnVyIFJhaG1hbiIsImlhdCI6MTc1MTMwODQ5OCwiZXhwIjoxNzUxMzEyMDk4fQ.QxXkbFs-qB50n9jzMUEqHQrlMa_HmseA9KBAGLjGI0H1qLMSgHK7haA1jxsK5O-mk_89ewm2pA4hwc6G0osBclHNER1Mlb7OX_Qw5WJ8_-7S623oSBFo4ByiahUQbKwOeGl9BMsqatErXUl8ClBhMZisRtyTpCcY13O8TGqkW2p7jTV0iaB3o2O1UD7VlTy7AZa41ajGuDrJUXveV0W_xDdaPnyZbaCzYpG1vGb2uVm2mTjYC8BGO-taEEJckBqs32gicoUYx_a6FwIkUQC_qshsbzzCfl04Mlqf10cROw-tVvh9c4QMkzN3y1oz2mkmJ3_eeQnnaVm4kVuZuU93ng',
                        1751312097,
                        NULL,
                        'https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile,openid',
                        NULL,
                        1751308498,
                        1751308498
                    );


-- Table: merchant_categories
CREATE TABLE IF NOT EXISTS merchant_categories (
    title       TEXT    NOT NULL,
    description TEXT,
    id          INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL,
    created_at  INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at  INTEGER DEFAULT (strftime('%s', 'now') ) 
);

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Local Restaurant',
                                    'A family-owned eatery serving traditional meals.',
                                    1,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Coffee Shop',
                                    'A small café offering coffee, pastries, and light snacks.',
                                    2,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Food Truck',
                                    'A mobile kitchen selling street food like tacos, burgers, or satay.',
                                    3,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Bakery',
                                    'Selling fresh bread, cakes, and pastries daily.',
                                    4,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Juice Bar',
                                    'Specializing in fresh juices, smoothies, and healthy snacks.',
                                    5,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Minimarket',
                                    'A small convenience store selling groceries, snacks, drinks, toiletries, etc.',
                                    6,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Butcher Shop',
                                    'Selling fresh meat and sometimes processed meat products.',
                                    7,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Stationery Store',
                                    'Offering school supplies, books, and office essentials.',
                                    8,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Clothing Boutique',
                                    'Selling casual or trendy fashion for specific demographics.',
                                    9,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Pet Shop',
                                    'Selling pet food, accessories, and small animals.',
                                    10,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Barbershop / Hair Salon',
                                    'Providing haircut and grooming services.',
                                    11,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Laundry Service',
                                    'Offering washing, drying, and ironing for clothes.',
                                    12,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Phone Repair Shop',
                                    'Fixing mobile phones and selling accessories.',
                                    13,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Tailor Shop',
                                    'Offering clothing alterations and custom tailoring.',
                                    14,
                                    1747991858,
                                    1747991858
                                );

INSERT INTO merchant_categories (
                                    title,
                                    description,
                                    id,
                                    created_at,
                                    updated_at
                                )
                                VALUES (
                                    'Motorcycle Workshop',
                                    'Doing repairs and maintenance for motorbikes.',
                                    15,
                                    1747991858,
                                    1747991858
                                );


-- Table: merchants
CREATE TABLE IF NOT EXISTS merchants (
    title            TEXT    NOT NULL,
    slug             TEXT    NOT NULL,
    description      TEXT,
    category         INTEGER,
    owner            INTEGER,
    greeting         TEXT    NOT NULL,
    primery_color    TEXT    DEFAULT 'fuel-yellow',
    image_background TEXT,
    logo             TEXT,
    id               INTEGER PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    created_at       INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at       INTEGER DEFAULT (strftime('%s', 'now') ),
    FOREIGN KEY (
        category
    )
    REFERENCES merchant_categories (id) ON UPDATE NO ACTION
                                        ON DELETE SET NULL,
    FOREIGN KEY (
        owner
    )
    REFERENCES user (id) ON UPDATE NO ACTION
                         ON DELETE CASCADE
);

INSERT INTO merchants (
                          title,
                          slug,
                          description,
                          category,
                          owner,
                          greeting,
                          primery_color,
                          image_background,
                          logo,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Tsurayya Food',
                          'tsurayya-food',
                          'tsurayya food official merchant',
                          1,
                          12,
                          'greeting ',
                          NULL,
                          NULL,
                          'merchant/f29ad259-f01c-4655-ad17-a401ed40eca7.webp',
                          27,
                          1749475223,
                          1751343006
                      );


-- Table: products
CREATE TABLE IF NOT EXISTS products (
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL,
    image       TEXT    NOT NULL,
    merchant    INTEGER NOT NULL,
    id          INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL,
    created_at  INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at  INTEGER DEFAULT (strftime('%s', 'now') ),
    FOREIGN KEY (
        merchant
    )
    REFERENCES merchants (id) ON UPDATE NO ACTION
                              ON DELETE CASCADE
);

INSERT INTO products (
                         title,
                         description,
                         image,
                         merchant,
                         id,
                         created_at,
                         updated_at
                     )
                     VALUES (
                         'Mie Njerit',
                         'Signature Noole By Tsurayya Food',
                         'product/92654742-c254-4fc2-b926-11c3d1df6e3d.webp',
                         27,
                         12,
                         1749476968,
                         1751343228
                     );

INSERT INTO products (
                         title,
                         description,
                         image,
                         merchant,
                         id,
                         created_at,
                         updated_at
                     )
                     VALUES (
                         'Mie Jebew',
                         'West Java signature noodle',
                         'product/55a9dd73-b469-4292-b1ec-ef8882320133.webp',
                         27,
                         13,
                         1751343436,
                         1751343436
                     );


-- Table: question_types
CREATE TABLE IF NOT EXISTS question_types (
    title       TEXT    NOT NULL,
    description TEXT,
    id          INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL,
    created_at  INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at  INTEGER DEFAULT (strftime('%s', 'now') ) 
);

INSERT INTO question_types (
                               title,
                               description,
                               id,
                               created_at,
                               updated_at
                           )
                           VALUES (
                               'text',
                               'collect customers opinion',
                               1,
                               1747991858,
                               1747991858
                           );

INSERT INTO question_types (
                               title,
                               description,
                               id,
                               created_at,
                               updated_at
                           )
                           VALUES (
                               'rating',
                               'collect the score given by customers',
                               2,
                               1747991858,
                               1747991858
                           );


-- Table: questions
CREATE TABLE IF NOT EXISTS questions (
    question       TEXT    NOT NULL,
    type           INTEGER NOT NULL,
    product        INTEGER NOT NULL,
    answer_options TEXT    DEFAULT '[]'
                           NOT NULL,
    id             INTEGER PRIMARY KEY AUTOINCREMENT
                           NOT NULL,
    created_at     INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at     INTEGER DEFAULT (strftime('%s', 'now') ),
    FOREIGN KEY (
        type
    )
    REFERENCES question_types (id) ON UPDATE NO ACTION
                                   ON DELETE SET NULL,
    FOREIGN KEY (
        product
    )
    REFERENCES products (id) ON UPDATE NO ACTION
                             ON DELETE CASCADE
);

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'What did you think about the portion size?',
                          1,
                          12,
                          '["Too small"," Just right"," Too big"]',
                          18,
                          1751344829,
                          1751344829
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How do you find the spiciness level?',
                          1,
                          12,
                          '["Not spicy enough","Perfect","Too spicy"]',
                          19,
                          1751344938,
                          1751344938
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How would you rate the noodle texture?',
                          1,
                          12,
                          '[" Too soft"," Just right","Too hard"]',
                          20,
                          1751344985,
                          1751344985
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Did you enjoy the toppings and ingredients included?
*What would you change or add?',
                          1,
                          12,
                          '[" Yes","No"]',
                          21,
                          1751345055,
                          1751345055
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How would you rate the value for money?',
                          1,
                          12,
                          '["Poor","Fair","Good","Excellent"]',
                          22,
                          1751345136,
                          1751345136
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Would you order the hot noodle again?',
                          1,
                          12,
                          '["Yes","No","Maybe"]',
                          23,
                          1751345176,
                          1751345176
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'What did you like most about the hot noodle?',
                          1,
                          12,
                          '[]',
                          24,
                          1751345191,
                          1751345191
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'What would you improve or change?',
                          1,
                          12,
                          '[]',
                          25,
                          1751345215,
                          1751345215
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Any other comments or suggestions?',
                          1,
                          12,
                          '[]',
                          26,
                          1751345296,
                          1751345296
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How would you rate the hot noodle?',
                          2,
                          12,
                          '[]',
                          27,
                          1751345380,
                          1751345380
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'What did you think about the portion size?',
                          1,
                          13,
                          '[" Too small","Just right"," Too big"]',
                          28,
                          1751345470,
                          1751345470
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How do you find the spiciness level?',
                          1,
                          13,
                          '["Not spicy enough","Perfect"," Too spicy"]',
                          29,
                          1751345517,
                          1751345517
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How would you rate the noodle texture?',
                          1,
                          13,
                          '[" Too soft"," Just right","Too hard"]',
                          30,
                          1751345557,
                          1751345557
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Did you enjoy the toppings and ingredients included?',
                          1,
                          13,
                          '["Yes","No"]',
                          31,
                          1751345606,
                          1751345606
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How would you rate the value for money?',
                          1,
                          13,
                          '["Poor","Fair","Good","Excellent"]',
                          32,
                          1751345723,
                          1751345723
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Would you order the hot noodle again?',
                          1,
                          13,
                          '["Yes","No","Maybe"]',
                          33,
                          1751345757,
                          1751345757
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'What did you like most about the hot noodle?',
                          1,
                          13,
                          '[]',
                          34,
                          1751345763,
                          1751345763
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'What would you improve or change?',
                          1,
                          13,
                          '[]',
                          35,
                          1751345774,
                          1751345774
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'Any other comments or suggestions?',
                          1,
                          13,
                          '[]',
                          36,
                          1751345784,
                          1751345784
                      );

INSERT INTO questions (
                          question,
                          type,
                          product,
                          answer_options,
                          id,
                          created_at,
                          updated_at
                      )
                      VALUES (
                          'How would you rate the hot noodle?',
                          2,
                          13,
                          '[]',
                          37,
                          1751345846,
                          1751345846
                      );


-- Table: respondents
CREATE TABLE IF NOT EXISTS respondents (
    name       TEXT    NOT NULL,
    gender     INTEGER NOT NULL,
    age        INTEGER NOT NULL,
    whatsapp   INTEGER,
    location   TEXT,
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at INTEGER DEFAULT (strftime('%s', 'now') ) 
);

INSERT INTO respondents (
                            name,
                            gender,
                            age,
                            whatsapp,
                            location,
                            id,
                            created_at,
                            updated_at
                        )
                        VALUES (
                            'response 1',
                            1,
                            28,
                            857123456677,
                            NULL,
                            1,
                            1748013618,
                            1748013618
                        );

INSERT INTO respondents (
                            name,
                            gender,
                            age,
                            whatsapp,
                            location,
                            id,
                            created_at,
                            updated_at
                        )
                        VALUES (
                            'respondent one',
                            1,
                            26,
                            6547457445654,
                            NULL,
                            2,
                            1748440193,
                            1748440193
                        );

INSERT INTO respondents (
                            name,
                            gender,
                            age,
                            whatsapp,
                            location,
                            id,
                            created_at,
                            updated_at
                        )
                        VALUES (
                            'respondent 1',
                            0,
                            20,
                            8575321348784,
                            NULL,
                            3,
                            1748609533,
                            1748609533
                        );


-- Table: response_answers
CREATE TABLE IF NOT EXISTS response_answers (
    response   INTEGER,
    question   INTEGER,
    answer     TEXT    NOT NULL,
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at INTEGER DEFAULT (strftime('%s', 'now') ),
    FOREIGN KEY (
        response
    )
    REFERENCES responses (id) ON UPDATE NO ACTION
                              ON DELETE CASCADE,
    FOREIGN KEY (
        question
    )
    REFERENCES questions (id) ON UPDATE NO ACTION
                              ON DELETE CASCADE
);


-- Table: responses
CREATE TABLE IF NOT EXISTS responses (
    merchant   INTEGER NOT NULL,
    respondent INTEGER,
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now') ),
    updated_at INTEGER DEFAULT (strftime('%s', 'now') ),
    FOREIGN KEY (
        merchant
    )
    REFERENCES merchants (id) ON UPDATE NO ACTION
                              ON DELETE CASCADE,
    FOREIGN KEY (
        respondent
    )
    REFERENCES respondents (id) ON UPDATE NO ACTION
                                ON DELETE SET DEFAULT
);


-- Table: session
CREATE TABLE IF NOT EXISTS session (
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       NOT NULL,
    expires_at INTEGER NOT NULL,
    token      TEXT    NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id    INTEGER NOT NULL,
    FOREIGN KEY (
        user_id
    )
    REFERENCES user (id) ON UPDATE NO ACTION
                         ON DELETE CASCADE
);

INSERT INTO session (
                        id,
                        expires_at,
                        token,
                        created_at,
                        updated_at,
                        ip_address,
                        user_agent,
                        user_id
                    )
                    VALUES (
                        35,
                        1750079989,
                        '98ZzizhJGHn61FxlUNTt4uE9CpmOiGH2',
                        1749475189,
                        1749475189,
                        '127.0.0.1',
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                        12
                    );

INSERT INTO session (
                        id,
                        expires_at,
                        token,
                        created_at,
                        updated_at,
                        ip_address,
                        user_agent,
                        user_id
                    )
                    VALUES (
                        36,
                        1750113326,
                        'Qik7QPdfxR8LUvyUGq1BEeQKJkpLvFu5',
                        1749508526,
                        1749508526,
                        '127.0.0.1',
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                        12
                    );

INSERT INTO session (
                        id,
                        expires_at,
                        token,
                        created_at,
                        updated_at,
                        ip_address,
                        user_agent,
                        user_id
                    )
                    VALUES (
                        37,
                        1750117091,
                        'ZH3uazTVqj52iEMJ73dkAyIWjxOfNCUI',
                        1749512291,
                        1749512291,
                        '127.0.0.1',
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                        12
                    );

INSERT INTO session (
                        id,
                        expires_at,
                        token,
                        created_at,
                        updated_at,
                        ip_address,
                        user_agent,
                        user_id
                    )
                    VALUES (
                        38,
                        1750152128,
                        'oVwQcDvwdSvvItTfXtH9eJ8GixEKSBwI',
                        1749547328,
                        1749547328,
                        '127.0.0.1',
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                        12
                    );

INSERT INTO session (
                        id,
                        expires_at,
                        token,
                        created_at,
                        updated_at,
                        ip_address,
                        user_agent,
                        user_id
                    )
                    VALUES (
                        39,
                        1751913298,
                        'ExZZ16PXaTAMvnvLctiwQVia5oylwzHG',
                        1751308498,
                        1751308498,
                        '127.0.0.1',
                        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
                        12
                    );


-- Table: user
CREATE TABLE IF NOT EXISTS user (
    id               INTEGER PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    name             TEXT    NOT NULL,
    email            TEXT    NOT NULL,
    email_verified   INTEGER NOT NULL,
    image            TEXT,
    created_at       INTEGER NOT NULL,
    updated_at       INTEGER NOT NULL,
    username         TEXT    NOT NULL,
    default_merchant INTEGER,
    FOREIGN KEY (
        default_merchant
    )
    REFERENCES merchants (id) ON UPDATE NO ACTION
                              ON DELETE SET NULL
);

INSERT INTO user (
                     id,
                     name,
                     email,
                     email_verified,
                     image,
                     created_at,
                     updated_at,
                     username,
                     default_merchant
                 )
                 VALUES (
                     12,
                     'M.Cholid Din Nur Rahman',
                     'cholid.dnr@gmail.com',
                     1,
                     'user/a06d5a03-d818-4777-ba8f-ddb267ebef12.webp',
                     1749475189,
                     1749475189,
                     'm.cholid-din-nur-rahman',
                     27
                 );


-- Table: verification
CREATE TABLE IF NOT EXISTS verification (
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       NOT NULL,
    identifier TEXT    NOT NULL,
    value      TEXT    NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER,
    updated_at INTEGER
);


-- Index: session_token_unique
CREATE UNIQUE INDEX IF NOT EXISTS session_token_unique ON session (
    token
);


-- Index: user_email_unique
CREATE UNIQUE INDEX IF NOT EXISTS user_email_unique ON user (
    email
);


-- Index: user_username_unique
CREATE UNIQUE INDEX IF NOT EXISTS user_username_unique ON user (
    username
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
