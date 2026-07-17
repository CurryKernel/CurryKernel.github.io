---
title: "华为校招笔试0424"
date: 2024-04-25
tags: ["校招", "华为"]
description: "华为校园招聘笔试三道算法题详解：满二叉搜索树查找、足球队员射门能力排序、找到内聚值最大的微服务群组"
---

## 第一题 满二叉搜索树查找

给定 `2^n - 1` 个不同的整数（`1 ≤ n ≤ 10`，n 为整数），构建一棵平衡满二叉搜索树。

二叉搜索树定义如下：

1. 节点的左子树只包含小于当前节点的数。
2. 节点的右子树只包含大于当前节点的数。
3. 所有左子树和右子树自身必须也是二叉搜索树。

例如 7 个数字 `'1234567'` 构建的满二叉搜索树如下所示：

```
    4
 2     6
1 3   5 7
```

**输入：** 输入分 2 行，第一行为 `2^n - 1` 个未排序的整数（空格分隔），第二行为待查找的整数。所有输入整数的取值范围为 `[-32768, 32767]`。

**输出：** 搜索的路径和结果。路径从根节点开始，用 `S` 表示，查找左树用 `L` 表示，查找右树用 `R` 表示，找到后使用 `Y` 表示，最终未找到使用 `N` 表示。

**样例 1：**

```
输入：2 1 3 7 5 6 4
      6
输出：SRY
解释：从根节点开始，路径的第一部分为 S。待查找数为 6，大于 4，所以要查找右树，路径增加 R，正好找到。最后增加 Y，最终输出 SRY。
```

**样例 2：**

```
输入：4 2 1 3 6 5 7
      5
输出：SRLY
解释：从根节点开始，一次往右树，往左树查找，找到结果 5，因此最终 SRLY。
```

**样例 3：**

```
输入：1 2 3 4 5 6 7
      8
输出：SRRN
解释：从根节点开始查找，标记 S，待查找数 8 比 4 大，所以查找右树标记 R；8 比 6 还大，继续查找右树标记 R；8 比右树节点 7 还大，但已经到了叶子，没有找到，最终标记 SRRN。
```

### 思路和代码

本质就是一个二叉搜索树的遍历，不过我们不用建立二叉树，可以用二分查找来代替。需要注意的是，访问到叶子节点后，如果还没有找到，此时并不增加路径。

**代码逻辑解释：**

1. **输入数据**：使用 `getline(cin, s)` 读取一行字符串，通过 `stringstream` 转换为整数并存储在向量 `v` 中，然后读取目标整数 `target`。
2. **构建平衡满二叉搜索树**：将输入的整数按升序排序，排序后取中间值作为根节点，递归地在左右子树中重复这个过程。
3. **搜索**：通过二分查找模拟 BST 的搜索过程。设置 `l` 为左边界，`r` 为右边界，计算 `m = (l + r) / 2`。
   - 如果 `v[m] == target`，路径加 `Y`，跳出循环。
   - 如果 `v[m] > target`，路径加 `L`，调整右边界 `r = m - 1`。
   - 如果 `v[m] < target`，路径加 `R`，调整左边界 `l = m + 1`。
4. **结果处理**：若搜索路径的最后一个字符不是 `Y`，则添加 `N`。

```cpp
#include <sstream>
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> v;
int target;

int main()
{
    stringstream ss;
    string s, t;
    getline(cin, s);
    ss << s;
    v.clear();
    while (ss >> t) {
        v.push_back(stoi(t));
    }
    cin >> target;
    sort(v.begin(), v.end());
    string ans = "S";
    int l = 0, r = v.size() - 1;
    int d = 0;
    while (l <= r) {
        int m = (l + r) / 2;
        d++;
        if (v[m] == target) { ans += "Y"; break; }
        if (v[m] > target) {
            if ((1 << (d)) > v.size()) break;
            ans += "L"; r = m - 1;
        } else {
            if ((1 << (d)) > v.size()) break;
            ans += "R"; l = m + 1;
        }
    }
    if (ans.back() != 'Y') ans += "N";
    cout << ans;
    return 0;
}
```

---

## 第二题 足球队员射门能力排序

球队有 `n` 个足球队员参与 `m` 次射门训练，每次射门进球用 `1` 表示，射失则用 `0` 表示。依据如下规则对该 `n` 个队员的射门能力做排序：

1. 进球总数更多的队员射门能力更强
2. 若进球总数一样多，则比较最多一次连续进球的个数，最多的队员能力更强
3. 若最多一次连续进球的个数一样多，则比较第一次射失的先后顺序，后射失的队员更强；若相同则继续比较第二次射失的顺序，依次类推
4. 若前 3 个规则排序后还能力相等，则队员编号更小的能力更强

**输入：** 第 1 行为队员数 `n` 和训练次数 `m`（队员编号从 1 开始）。第 2 行为每个队员的进球情况（连续的 `1` 和 `0` 组合），不同队员用空格分隔。`0 < n ≤ 10³, 0 < m ≤ 10³`。

**输出：** 射门能力从强到弱的队员编号，用空格分隔。

**样例：**

```
输入：
4 5
11100 0011110111 01111
输出：
4 3 1 2
解释：队员 3 和 4 进球数均为 4 个，比队员 1 和 2 的 3 个更多。队员 3 连续进球数最多为 3 个，而队员 4 最大为 4。因此队员 4 强于队员 3。队员 2 比队员 1 先丢球，因此队员 1 强于队员 2。排序为 4 3 1 2。
```

### 思路和代码

本质就是一个排序问题，需要预处理数据：每个人的进球数、最多连续进球个数、失球顺序，然后按照题目要求排序。

```cpp
#include <sstream>
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main()
{
    int n, m; cin >> n >> m;
    vector<int> goals(n, 0), seq(n, 0);
    vector<vector<int>> fs(n);
    for (int i = 0; i < n; ++i) {
        string s; cin >> s;
        int g = 0, mx_s = 0, cur_s = 0;
        for (int j = 0; j < m; ++j) {
            g += (s[j] == '1');
            if (s[j] == '1') ++cur_s;
            else {
                fs[i].push_back(j);
                mx_s = max(mx_s, cur_s); cur_s = 0;
            }
        }
        goals[i] = g; seq[i] = max(mx_s, cur_s);
    }
    vector<int> idx(n);
    for (int i = 0; i < n; ++i) idx[i] = i;
    sort(idx.begin(), idx.end(), [&](auto& a, auto& b) {
        if (goals[a] > goals[b]) return true;
        if (goals[a] < goals[b]) return false;
        if (seq[a] > seq[b]) return true;
        if (seq[a] < seq[b]) return false;
        int sz = fs[a].size();
        for (int j = 0; j < sz; ++j) {
            if (fs[a][j] > fs[b][j]) return true;
            if (fs[a][j] < fs[b][j]) return false;
        }
        return a < b;
    });
    for (int i = 0; i < n; ++i) {
        cout << idx[i] + 1;
        if (i != n - 1) cout << " ";
    }
    return 0;
}
```

---

## 第三题 找到内聚值最大的微服务群组

开发团队为了调研微服务调用情况，对 `n` 个微服务调用数据进行了采集分析。微服务使用数字 `0` 至 `n-1` 进行编号。给定数组 `edges`，其中 `edges[i]` 表示存在一条从微服务 `i` 到微服务 `edges[i]` 的接口调用。

我们将形成 1 个环的多个微服务称为微服务群组。一个微服务群组的所有微服务数量为 `L`，能够访问到该微服务群组的微服务数量为 `V`，这个微服务群组的内聚值 `H = L - V`。

已知提供的数据中有 1 个或多个微服务群组，按照内聚值从大到小排序（`H` 相等时取环中最大的数比较），输出排在第一的微服务群组。输出时起始编号为环中最小的数。

**输入：** 第一行为 `n`，第二行为数组 `edges`。`n == edges.length, 2 ≤ n ≤ 10⁵, 0 ≤ edges[i] ≤ n-1, edges[i] != i`。

**样例 1：**

```
输入：
4
3 3 0 1
输出：
0 3 2
```

**样例 2：**

```
输入：
12
2 6 10 1 6 0 3 0 5 4 5 8
输出：
0 2 10 5
```

### 思路和代码

使用拓扑排序（Kahn 算法）逐步删除入度为 0 的节点，剩下的节点必然在环中。然后遍历找到每个环并计算内聚值。

```cpp
#include <sstream>
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;
int n;

int main()
{
    cin >> n;
    vector<int> edges(n);
    vector<int> in(n, 0);
    vector<int> nums(n, 0);
    for (int i = 0; i < n; ++i) {
        cin >> edges[i];
        in[edges[i]]++;
    }
    queue<int> q;
    for (int i = 0; i < n; ++i) {
        if (in[i] == 0) q.push(i);
    }
    while (!q.empty()) {
        int sz = q.size();
        while (sz--) {
            int f = q.front(); q.pop();
            in[edges[f]]--;
            nums[edges[f]] += nums[f] + 1;
            if (in[edges[f]] == 0) {
                q.push(edges[f]);
            }
        }
    }
    vector<vector<int>> cir;
    vector<int> value;
    vector<int> mx;
    for (int i = 0; i < n; ++i) {
        if (in[i] == 0) continue;
        int c = i, v = 0, mx_no = i;
        vector<int> path;
        while (in[c]) {
            v += nums[c];
            path.push_back(c); in[c] = 0;
            c = edges[c];
            mx_no = max(mx_no, c);
        }
        cir.push_back(path);
        mx.push_back(mx_no);
        value.push_back(path.size() - v);
    }
    vector<int> idx(value.size());
    for (int i = 0; i < value.size(); ++i) idx[i] = i;
    sort(idx.begin(), idx.end(), [&](auto& a, auto& b) {
        return value[a] == value[b] ? mx[a] > mx[b] : value[a] > value[b];
    });
    auto& path = cir[idx[0]];
    int start = *min_element(path.begin(), path.end());
    for (int i = 0; i < path.size(); ++i) {
        cout << start;
        start = edges[start];
        if (i != path.size() - 1) cout << " ";
    }
    return 0;
}
```
