/**
 * Choreo Connection Test Script
 * Run this in browser console to test the connection
 */

console.log('🔍 Testing Choreo Connection...\n');

// Test 1: Health Check
async function testHealthCheck() {
    console.log('Test 1: Health Check');
    try {
        const response = await fetch('/choreo-apis/default/research-assistant-api/v1/api/v1/health');
        const data = await response.json();
        console.log('✅ Health check passed:', data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error);
        return false;
    }
}

// Test 2: List Documents
async function testListDocuments() {
    console.log('\nTest 2: List Documents');
    try {
        const response = await fetch('/choreo-apis/default/research-assistant-api/v1/api/v1/documents');
        const data = await response.json();
        console.log('✅ List documents passed:', data);
        return true;
    } catch (error) {
        console.error('❌ List documents failed:', error);
        return false;
    }
}

// Test 3: Check API Info
async function testAPIInfo() {
    console.log('\nTest 3: API Info');
    try {
        const response = await fetch('/choreo-apis/default/research-assistant-api/v1');
        const data = await response.json();
        console.log('✅ API info:', data);
        return true;
    } catch (error) {
        console.error('❌ API info failed:', error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('='.repeat(50));
    console.log('🧪 Running Choreo Connection Tests');
    console.log('='.repeat(50));

    const results = {
        health: await testHealthCheck(),
        documents: await testListDocuments(),
        apiInfo: await testAPIInfo(),
    };

    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results:');
    console.log('='.repeat(50));
    console.log(`Health Check: ${results.health ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`List Documents: ${results.documents ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`API Info: ${results.apiInfo ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = Object.values(results).every(r => r);
    console.log('\n' + (allPassed ? '✅ All tests passed!' : '❌ Some tests failed'));

    return results;
}

// Auto-run tests
runAllTests();
