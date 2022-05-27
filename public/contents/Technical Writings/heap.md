# Heap in Python

## 1. What is Heap and When to Use It

A [heap](https://en.wikipedia.org/wiki/Heap_%28data_structure%29) is a specialized **tree-based data structure** which is essentially an almost complete tree that satisfies the **heap property**. The heap property differs between types of heap. For example, in a max heap, the heap property would be: "the data stored in the parent node is always larger than data in its children". A min heap is the opposite.

Heap as a data structure is **partially sorted**. In a max/min heap, relationships between most nodes other than the root node are not consistent. The heap is only useful when extracting the max/min value in the tree, which is the root. This is a potential drawback of heap if we want to explore the values between the extremes.

Heap is a most common implementation of [priority queue](https://en.wikipedia.org/wiki/Priority_queue), which is a list-like abstract data type that stores each element with a "priority" and automatically sorts them with each push/pull. While heap and priority queue are two distinct concepts, programmers often use them interchangeably as they serve the same function. For example, python's [heapq library](https://docs.python.org/3.8/library/heapq.html#priority-queue-implementation-notes) contains an implementation of priority queue using heap.

## 2. Implementations

Pushing data into heap that uses binary tree involves 2 steps. First we need to insert the node such that the tree is complete \(all nodes excpet leaves have two children, and all nodes are as far to the left as possible\). Second, we need to rearrange the tree such that it satisfy the heap property with the addition of a new node.

### 2.1. Implementation Using Binary Tree

\(Related problem: [\[LC919\] Complete Binary Tree Inserter](https://leetcode.com/problems/complete-binary-tree-inserter/)\)

For a binary tree implementation of the heap, the two problems needs to be solved with additional components in the binary tree data structure. ~~At first I attempted to solve the first problem by keeping track of the number of nodes in the tree, since the shape of a completed tree is unique to the number of nodes in it. However, predicting the path to traverse to the right position using only a number proved to be too complicated.~~ The solution to the first problem is to keep track of the incomplete nodes in the heap data structure, so that they can be pulled out and attach new children if needed.

The second problem can be solved by modifying the binary tree into a bi-directional tree. This allow the newly installed leaf to climb all the way up to the root to make sure the heap property is satisfied.

```python
class BiDirBTree:

    def __init__(self, data, parent):
        self.parent = parent
        self.data = data
        self.left = None
        self.right = None


class HeapTree:

    def __init__(self, data):
        self.tree = BiDirBTree(data, None)
        self.queue = [self.tree] # list of potentially imcomplete nodes 


    def swap(self, a, b):
        a.data, b.data = b.data, a.data


    # push new data into the heap and rearrange it to satisfiy max-heap property
    def push(self, data):

        while self.queue:

            # pull out the first incomplete node
            next_incomplete_node = self.queue[0]
            new_child = BiDirBTree(data, next_incomplete_node)

            # check if the node is complete; if not, attach child
            if next_incomplete_node.left is None:
                next_incomplete_node.left = new_child
                self.queue.append(next_incomplete_node.left)
                break
            elif next_incomplete_node.right is None:
                next_incomplete_node.right = new_child
                self.queue.append(next_incomplete_node.right)
                break
            # if the node is complete, throw it out of the queue
            else: 
                self.queue.pop(0)

        # traverse up the tree to enforce heap property
        cur = new_child
        while cur.parent is not None and cur.data > cur.parent.data:
            self.swap(cur.parent, cur)
            cur = cur.parent


    # pop out the largest element and rearrange heap
    def pop(self):

        # pull out the last incomplete node
        last_incomplete_node = self.queue.pop(-1) 
        # replace root with that value
        output = self.tree.data
        self.swap(self.tree, last_incomplete_node)
        # delete the last incomplete node
        if last_incomplete_node.parent:
            if last_incomplete_node.parent.right:
                last_incomplete_node.parent.right = None
            else:
                last_incomplete_node.parent.left = None

        # rearrange nodes 
        self.heapify(self.tree)
        return output


    def heapify(self, cur):
        left = cur.left.data if cur.left else 0
        right = cur.right.data if cur.right else 0

        if cur.right and right>left and right>cur.data:
            self.swap(cur.right, cur)
            self.heapify(cur.right)
        elif cur.left and left>right and left>cur.data:
            self.swap(cur.left, cur)
            self.heapify(cur.left)
        else: return
```

```python
htree = HeapTree(1)
htree.push(2)
htree.push(3)
htree.push(4)
htree.push(5)
print(htree.pop())
print(htree.pop())
print(htree.pop())
```

```text
5
4
3
```

While the binary tree is consistant with the conceptual diagram, it is relatively cumbersome to implement. The operations involves a lot of object swapping and tree traversing, which is not human friendly. The operations are `O(logn)`, since only one path from root to leaf is traversed. However, the queue in the heap data structure takes up an extra `O(0.5n)=O(n)` space, and the pointers in the BiDirTree structure also takes up space.

### 2.2. Implementation Using Array

Since the binary tree is complete, we can flatten the tree into an array. The array represent a preorder traversal of the binary tree, whose number of nodes in each layer constitute a geometric sequence of 2. Parent and children notes can be access by index calculation. The following diagram shows a min-heap and corresponding array representation.

![Tree to array](https://www.geeksforgeeks.org/wp-content/uploads/binaryheap.png)

Using observation, we can see patterns for accessing neighboring nodes of node `heap[i]`:

* parent: `heap[(i-1)/2]`
* left child: `heap[i*2+1]`
* right child: `heap[i*2+2]`

```python
class Heap:
    def __init__(self, data):
        self.data = data

    # helper    
    def swap(self, ai, bi):
        self.data[ai], self.data[bi] = self.data[bi], self.data[ai]


    def push(self, data):
        # append data to the end of array 
        # (aka left most node in bottom layer of the binary tree)
        self.data.append(data)

        # using index to traverse up the tree s.t. it satisfy heap property
        cur = len(self.data)-1

        # rearrange: while cur is not at the top and cur is larger than its parent
        while cur!=0 and self.data[(cur-1)//2] < self.data[cur]:
            self.swap((cur-1)//2, cur)
            cur = (cur-1)//2


    def pop(self):
        res = self.data.pop(0)
        self.heapify(0)
        return res


    # rearrange a partially heapified array starting from index i
    def heapify(self, i):
        left = i*2+1
        right = i*2+2
        largest = i

        # check which node is the largest; 
        if left<len(self.data) and self.data[left]>self.data[i]:
            largest = left
        elif right<len(self.data) and self.data[right]>self.data[i]:
            largest = right

        # if i is not largest, swap it
        if largest!=i:
            self.swap(largest, i)
            self.heapify(largest)
```

```python
h = Heap([2,1])
h.push(9)
h.push(4)
h.push(5)
h.push(7)
print(h.data)
print(h.pop())
print(h.pop())
print(h.pop())
print(h.data)
```

```text
[9, 5, 7, 1, 4, 2]
9
7
5
[4, 1, 2]
```

### 2.3. Conclusion

Both method follows the same idea with their operation. `heap.push()` pushes to the last node of the complete tree and walk upwards until the orders are correct. `heap.pop()` replaces value of that top node with value of the last node and walk downwards. However, the array is a much better implementation from both programmer's and memory's perspective.

## 3. Applications

### 3.1. Heap Sort

Heap sort is one of the best sorting algorithms out there. It works by pushing everything into a heapified array and popping everything back out, which gives it a `O(nlogn)` time complexity across the board. The algorithm also gets bonus points by allowing sorting in place, giving it `O(1)` auxiliary space complexity.

```python
def heapsort(arr):
    h = Heap([])
    l = len(arr)
    for i in range(l):
        h.push(arr.pop())
    for i in range(l):
        arr.append(h.pop())
    return arr
```

```python
arr1 = [5,6,2,7,3,1,9,8]
print(heapsort(arr1))
arr2 = [23,14,12,9,35,10,8,20]
print(heapsort(arr2))
```

```text
[9, 8, 7, 6, 5, 2, 3, 1]
[35, 23, 20, 14, 10, 12, 9, 8]
```

### 3.2. Priority Queue

Heap can deal with anything that uses to a priority queue. The spirit of priority queue is that, whatever element goes into the queue gets sorted with `O(logn)` time. This makes a lot of problem trivial right away.

Some examples:

* [\[LC23\] Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/): throw everything into a heap and pop out everything.
* [\[LC973\] K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/): calculate distance and throw points into a max-heap, sorted by their distance. Output the first K elements.

Problems above can also be solved using quick sort, since they do not need to access heap elements dynamically. Some problems, however, requires a little twist:

* [\[LC253\] Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/): each element in the min-heap represent a room's next available time; once a new meeting is process, the min-heap automatically pops out the earliest available room.
* [\[LC295\] Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/): two heaps; one large min-heap to store numbers larger than median, one small max-heap to store numbers smaller than median; take the average of the top of two heaps or choose one to get median.

### 3.3. Heap Sort in Python

The `heapq` module in python provides a min-heap.

```python
import heapq

arr3 = [23,11,15,39,35,13,28,21,34]
heapq.heapify(arr3) 
heapq.heappop(arr3) # 11
heapq.heappop(arr3) # 13
heapq.heappushpop(arr3, 21) # 15

# invert elements for max-heap
arr4 = [-i for i in arr3]
heapq.heapify(arr4)
-heapq.heappop(arr4) # 39
-heapq.heappop(arr4) # 35
-heapq.heappop(arr4) # 34

# also able to sort tuples (by first element)
arr5 = [(7,9,2), (1,3,2), (5,3,6), (2,4,7)]
heapq.heapify(arr5) 
heapq.heappop(arr5) # (1, 3, 2)
heapq.heappop(arr5) # (2, 4, 7)
heapq.heappop(arr5) # (5, 3, 6)
```

## 4. TLDR

