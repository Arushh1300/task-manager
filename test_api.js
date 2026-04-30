const axios = require('axios');

const baseURL = 'http://localhost:5000/api';
let adminToken = '';
let memberToken = '';
let projectId = '';
let taskId = '';
let adminId = '';
let memberId = '';

const tests = [];
let passCount = 0;
let failCount = 0;

const assert = (condition, message) => {
  if (condition) {
    tests.push({ status: 'PASS', message });
    passCount++;
  } else {
    tests.push({ status: 'FAIL', message });
    failCount++;
  }
};

const runTests = async () => {
  console.log('--- Starting API Tests ---\n');

  try {
    // 1. Auth: Signup Valid Admin
    try {
      const res = await axios.post(`${baseURL}/auth/signup`, {
        name: 'Admin User',
        email: `admin${Date.now()}@test.com`,
        password: 'password123',
        role: 'admin'
      });
      assert(res.status === 201 && res.data.token, 'Signup valid admin user');
      adminToken = res.data.token;
      adminId = res.data._id;
    } catch (e) {
      assert(false, `Signup valid admin user: ${e.message}`);
    }

    // 1. Auth: Signup Valid Member
    try {
      const res = await axios.post(`${baseURL}/auth/signup`, {
        name: 'Member User',
        email: `member${Date.now()}@test.com`,
        password: 'password123',
        role: 'member'
      });
      assert(res.status === 201 && res.data.token, 'Signup valid member user');
      memberToken = res.data.token;
      memberId = res.data._id;
    } catch (e) {
      assert(false, `Signup valid member user: ${e.message}`);
    }

    // 1. Auth: Signup Missing Fields
    try {
      await axios.post(`${baseURL}/auth/signup`, { email: 'test@test.com' });
      assert(false, 'Signup missing fields should fail');
    } catch (e) {
      assert(e.response && e.response.status === 400, 'Signup missing fields returns 400');
    }

    // 1. Auth: Login Correct Credentials
    try {
      const res = await axios.post(`${baseURL}/auth/login`, {
        email: 'admin@test.com', // Assuming this exists or using the one we just made might be better, let's use the one we just made. wait, I used Date.now(). Let me login with the member we just made.
      });
      // Skip this, I didn't save the email. Let's just create a fixed user.
    } catch(e) {}
    
    // I'll rewrite the login test.
    const uniqueEmail = `testuser${Date.now()}@test.com`;
    await axios.post(`${baseURL}/auth/signup`, { name: 'Test', email: uniqueEmail, password: 'password123' });

    try {
      const res = await axios.post(`${baseURL}/auth/login`, { email: uniqueEmail, password: 'password123' });
      assert(res.status === 200 && res.data.token, 'Login with correct credentials');
    } catch (e) {
      assert(false, 'Login with correct credentials failed');
    }

    // 1. Auth: Login Wrong Password
    try {
      await axios.post(`${baseURL}/auth/login`, { email: uniqueEmail, password: 'wrongpassword' });
      assert(false, 'Login with wrong password should fail');
    } catch (e) {
      assert(e.response && e.response.status === 401, 'Login wrong password returns 401');
    }

    // 2. Authz: Access protected route without token
    try {
      await axios.get(`${baseURL}/projects`);
      assert(false, 'Access protected route without token should fail');
    } catch (e) {
      assert(e.response && e.response.status === 401, 'Access without token returns 401');
    }

    // 2. Authz: Access with token
    try {
      const res = await axios.get(`${baseURL}/projects`, { headers: { Authorization: `Bearer ${memberToken}` } });
      assert(res.status === 200, 'Access protected route with token');
    } catch (e) {
      assert(false, 'Access protected route with token failed');
    }

    // 3. Projects: Create Project (Admin)
    try {
      const res = await axios.post(`${baseURL}/projects`, {
        name: 'Test Project',
        description: 'Testing',
        members: [memberId]
      }, { headers: { Authorization: `Bearer ${adminToken}` } });
      assert(res.status === 201, 'Admin can create project');
      projectId = res.data._id;
    } catch (e) {
      assert(false, `Admin create project failed: ${e.response?.data?.message || e.message}`);
    }

    // 2. Authz: Create Project (Member) - should fail
    try {
      await axios.post(`${baseURL}/projects`, {
        name: 'Test Project 2',
        description: 'Testing'
      }, { headers: { Authorization: `Bearer ${memberToken}` } });
      assert(false, 'Member should not be able to create project');
    } catch (e) {
      assert(e.response && e.response.status === 403, 'Member create project returns 403');
    }

    // 4. Tasks: Create Task (Admin)
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1); // tomorrow

      const res = await axios.post(`${baseURL}/tasks`, {
        title: 'Test Task',
        description: 'Testing task creation',
        projectId: projectId,
        assignedTo: memberId,
        dueDate: dueDate.toISOString()
      }, { headers: { Authorization: `Bearer ${adminToken}` } });
      assert(res.status === 201, 'Admin can create task');
      taskId = res.data._id;
    } catch (e) {
      assert(false, `Admin create task failed: ${e.response?.data?.message || e.message}`);
    }

    // 4. Tasks: Update Task Status
    try {
      const res = await axios.put(`${baseURL}/tasks/${taskId}`, {
        status: 'in-progress'
      }, { headers: { Authorization: `Bearer ${memberToken}` } });
      assert(res.status === 200 && res.data.status === 'in-progress', 'Update task status');
    } catch (e) {
      assert(false, `Update task status failed: ${e.response?.data?.message || e.message}`);
    }
    
    // 7. Edge Cases: Empty inputs in project creation
    try {
       await axios.post(`${baseURL}/projects`, {
        name: '',
        description: ''
      }, { headers: { Authorization: `Bearer ${adminToken}` } });
      assert(false, 'Create project with empty inputs should fail');
    } catch (e) {
      assert(e.response && e.response.status === 400, 'Create project with empty inputs returns 400');
    }

  } catch (error) {
    console.error('Test execution error:', error.message);
  }

  console.log('\n--- Test Results ---');
  tests.forEach(t => {
    console.log(`[${t.status}] ${t.message}`);
  });
  console.log(`\nTotal: ${tests.length} | Pass: ${passCount} | Fail: ${failCount}`);
};

runTests();
