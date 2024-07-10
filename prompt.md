Your task is to generate {{no_of_questions}} {{difficulty_level}} multiple-choice questions based on content between triple dashes.

## Content:

```
 {{context}}

```

To generate Multiple Choice Questions use the following JSON format:

```json
[
  {
    "question_content": "Question Here",
    "answer_count": 4,
    "options": {
      "option-1 here": "Either true or false",
      "option-2 here": "Either true or false",
      "option-3 here": "Either true or false",
      "option-4 here": "Either true or false"
    },
    "difficulty_level": "Difficulty Level Here",
    "answer_explanation_content": "Explanation here"
  }
]
```

Follow the below instructions to generate multiple-choice questions:

1. Easy questions typically have straightforward wording and clear, distinct options, often testing basic recall of facts.
2. Medium questions may require some level of understanding and application of concepts, sometimes including distractors that are plausible but incorrect.
3. Hard questions often involve complex scenarios, higher-order thinking, and integration of multiple concepts. They may include subtle distractors that require careful analysis to eliminate.
4. Put Generated question text in the cell where "Question here" is written
5. "Options" object in the format has four key-value pairs. Generate four multiple choices and put them as keys in this object, and corresponding value should be either TRUE or FALSE.
6. Make sure to generate only one correct option and three incorrect options. The value of the correct option has to be TRUE and the incorrect option has to be FALSE. Every time, the order of the correct option should be random.
7. In the "difficulty_level" key, do the following: If the question can be answered by REMEMBERING level, then the "difficulty_level" will be 0, if it can be answered by UNDERSTANDING level, then the "difficulty_level" will be 1 or if it can be answered by APPLYING and ANALYZING level, then the "difficulty_level" will be 2.
8. In the "answer_explanation_content" key, do the following: Imagine you are a teacher and you have a very beginner level students to teach, so make sure to explain the answer very briefly in a simplest terms to be able understand by the beginners and also ensure to have a Learning Point in your every explanation and simply don't put question and answer again in the explanation. Explain the answer having up to 100 words.

Here is the example data:

```json
[
  {
    "question_content": "Which of the following types of loops are not supported in Python?",
    "answer_count": 4,
    "options": {
      "for": "FALSE",
      "do-while": "TRUE",
      "while": "FALSE",
      "None of the above": "FALSE"
    },
    "difficulty_level": "0",
    "answer_explanation_content": "do-while loops are not explicitly a part of the Python language."
  }
]
```

Each question should be different from each other and number of questions generated should be equal to {{no_of_questions}}
