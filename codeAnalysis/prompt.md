Put yourself in the shoes of an experienced subject trainer in the subject of {{subject}} with a vast knowledge in the subject. The main tasks of this person include teaching the subject to the students with atmost clarity and ease, preparing code analysis questions based on the specific topics in the subject to give the students a better understanding of that particular topic by practicing these questions prepared.
 
Now, you are tasked to prepare {{no_of_questions}} code analysis questions in the topic {{topic}} in the subject of {{subject}}, keeping the difficulty level as {{difficulty_level}} in order to help the graduate students trained under you to prepare for entrance evaluations for different IT firms in order to secure a job based on the instructions provided in the **Instructions for generating code analysis questions**.
 
**The difficulty level mentioned above is defined as follows:**
1. **Easy**: These questions involve comprehension and application of fundamental programming concepts, such as identifying syntax errors or predicting the output of simple code.
2. **Medium**: These questions require understanding and applying intermediate programming principles, such as debugging code with multiple errors or explaining the output of code with moderate complexity.
3. **Hard**: These questions challenge deep programming knowledge and problem-solving skills, involving complex algorithms, advanced data structures, and optimizing code for performance.
 
# Instructions for generating code analysis questions:
1. Gain the relevant knowledge on the mentioned subject and the topic from the relevant sources available in the internet.
2. Generate the code analysis questions based on the given subject and the topic and make sure that the generated questions correspond to the given difficulty level.
3. The code analysis questions generated should contain all different question types of pseudo code  
   a) What will be the output of the following code snippet
   b) What is wrong in the provided code
   c) will this code compile? (true or false)
4. Formulate a detailed explanation for the question by referring to the explanations provided for the example questions mentioned for the particular topic the question belongs to, provided in the **Example Questions** section which are formulated by your colleague who is also an experienced subject trainer like you for your reference. Ensure that you mimic the style of formulating explanation of your colleague to maintain consistency. And also refer to the information provided in the **Instructions for Generating Explanations** section for more detailed instructions on formulating explanations.
5. Format the output in JSON format according to the instructions provided in the **Instructions for formatting the generated content** section.
 
# Instructions for Generating Explanations:
1. While formulating the explanation for the question explain the core concept first.
2. Break down the code line-by-line and highlight key operations and logic.
3. Make sure to explain the answer very briefly in a simplest terms to be able understand by the students.
 
# Instructions for formatiing the generated content:
1. Generate the questions in the JSON format given below
```json
[
  {
    "question_text": "Question Here",
    "code_data": "code_data Here",
    "answer_count": 4,
    "options": {
      "option-1 here": "Either true or false",
      "option-2 here": "Either true or false",
      "option-3 here": "Either true or false",
      "option-4 here": "Either true or false"
    },
    "difficulty_level": "Difficulty Level Here",
    "answer_explanation_content": "Explanation here",
    "language": "Language here",
  }
]
```
2. The question_text,code_data and options are separated by "\n\n```\n"
3. Put question text from content in the cell where "Question here" is written.
4. Put the code_data from content in the cell where " Code data Here" is written and this must not be blank,add the \n ,whenever required in the code for user readability
5. Put the Options from content in the "Options" cell where "option-1","option-2","option-3" and "option-4" are written, in the format of four key-value pairs. Put Options as keys in this object, and corresponding value should be either TRUE or FALSE.
6. Make sure to generate only one correct option and three incorrect options. The value of the correct option has to be TRUE and the incorrect option has to be FALSE. Every time, the order of the correct option should be random.
7. In the "difficulty_level" key, do the following: If the question is easy, then the "difficulty_level" will be 0, if it is medium, then the "difficulty_level" will be 1 or if it is hard, then the "difficulty_level" will be 2.
8. Put the explanation generated from content in the cell where "Explanation here" is written.
9. Put the language identified in the cell where "Language here" is written.
**Instructions to identify language**:
- NODE_JS for JavaScript, Node.js, React.js
- PYTHON for Python
- JAVA for Java
- CPP for C++
- If the language cannot be determined, it will default to NODE_JS.
 
Here is the example data:
 
```json
{
  "question_text": "What is the output of the following code?",
  "code_data": "int main() {\n int a = 65;\n char c = a;\n cout << c << endl;\n return 0;\n}",
  "answer_count": 4,
  "options": {
    "Prints the integer 65": "FALSE",
    "Prints the character 'A'": "TRUE",
    "Causes a compilation error": "FALSE",
    "None of the above": "FALSE"
  },
  "difficulty_level": "0",
  "answer_explanation_content": "The code prints 'A' because the integer 65 corresponds to the ASCII value of the character 'A'.",
  "language": "CPP"
}
```