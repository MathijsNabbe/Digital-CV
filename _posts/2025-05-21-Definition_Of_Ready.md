---
title: Definition Of Ready
layout: post
author: Mathijs Nabbe
tags: [Scrum]
---

This document outlines the acceptance criteria for a work item to be considered ready for estimation and inclusion in a sprint. These criteria have been collaboratively established by the team and are enforced collectively. A complementary document, the Definition of Done, details all implicit criteria for considering a task as complete.

# 1. Shared understanding
All team members must have a shared understanding of the work to be done. Each work item should align with the INVEST criteria:

* **Independent**: The task should be self-contained and not dependent on the completion of other pending tasks.
* **Negotiable**: The implementation should remain flexible, allowing for adaptation as new insights emerge.
* **Valuable**: The task must deliver value to the product, fulfilling a clear purpose.
* **Estimable**: The work must be sufficiently defined so that it can be estimated accurately. If a task is not feasible, achievable, or measurable, it cannot be estimated.
* **Small**: Tasks should be of a manageable size. Complex items must be broken down into simpler, smaller tasks, which are easier to both manage and estimate.
* **Testable**: The outcome must be verifiable through testing. If a task cannot be tested, it cannot be confirmed as completed to specification.

 
# 2. Required Sections
### 2.1 User story

The user story should clearly state the purpose and scope of the task in a way that is understandable to all team members. It must explain what is to be done and why it is necessary.
2.2 Acceptance criteria

Acceptance criteria describe the expected outcomes of the work. These can range from simple statements such as "the user can click the button" to more complex conditions like "when the module is invoked, a request is sent to the remote service."

These criteria may be phrased as questions, allowing reviewers and testers to quickly validate the delivered work against the acceptance criteria.

# 3. Optional Sections
### 3.1 Additional information

This section may include references to external APIs, links to design files, or background information relevant to the task. For bugs, it may specify the software version or environment. For user stories, it may provide context or dependencies.

# 4. Requirements

To meet the Definition of Ready, a work item must conform to several key requirements, beyond the structural formatting of its description. These criteria may vary depending on the type of work item.

### 4.1 Is the Work Item Valuable?

Stakeholders should be informed and in agreement regarding the scope and implementation of the task. For customer-facing work, this may involve the Delivery Manager; for internal tools, the Technical Lead may be the appropriate stakeholder.

### 4.2 Is the Work Item Scoped to a Single User Story?

Maintaining a narrow scope is essential. If the user story describes multiple scenarios, the task should be converted into an epic, with each scenario represented as a separate child item.

### 4.3 Does the User Story Align with the Motivation?

 For bug reports, the user story must reflect the original motivation for addressing the issue. For example, if a customer reported the bug, the work item should resolve the described problem.

### 4.4 Is the Work Item Open to Implementation?

The work item should provide sufficient information, while avoiding prescriptive implementation details. Predefining the entire solution without allowing for technical discovery can be counterproductive.

### 4.5 Can the Bug Be Reproduced?

Bug-type work items must include clear steps to reproduce the issue. For UI bugs, annotated screenshots are essential to guide the developer effectively.

### 4.6 Is the User Story Locatable in the Application?

Vague descriptions like "this is broken" are unhelpful. The task must clearly identify the affected module, page, or section of the application to minimize research time before implementation.

### 4.7 Is the Requested Change Clearly Specified?

For bug reports, both the current (incorrect) behavior and the expected (correct) behavior must be documented. This goes in line with point 4.1, as stakeholder must approve the proposed changes.

### 4.8 Are All Attachments Relevant?

Attachments such as screenshots or test data must be directly relevant and clearly annotated. A group of vague unguided test data may create confusion and hinder development.