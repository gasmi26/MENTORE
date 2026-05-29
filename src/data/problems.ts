/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DSAProblem } from '../types';

export const DSA_PROBLEMS: DSAProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starters: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    return [];
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack & Queue',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    starters: {
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      python: `def isValid(s: str) -> bool:
    # Write your code here
    pass`,
      typescript: `function isValid(s: string): boolean {
    // Write your code here
    return false;
}`,
      cpp: `bool isValid(string s) {
    // Write your code here
    
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`
    }
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]'
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]'
      }
    ],
    starters: {
      javascript: `function reverseList(head) {
    // Write your code here
    
}`,
      python: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    # Write your code here
    pass`,
      typescript: `function reverseList(head: ListNode | null): ListNode | null {
    // Write your code here
    return null;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    // Write your code here
    
}`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your code here
        return null;
    }
}`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    starters: {
      javascript: `function search(nums, target) {
    // Write your code here
    
}`,
      python: `def search(nums: List[int], target: int) -> int:
    # Write your code here
    pass`,
      typescript: `function search(nums: number[], target: number): number {
    // Write your code here
    return -1;
}`,
      cpp: `int search(vector<int>& nums, int target) {
    // Write your code here
    
}`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your code here
        return -1;
    }
}`
    }
  }
];
