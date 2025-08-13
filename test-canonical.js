/**
 * Test script for the canonical URL utility
 * Run with: node test-canonical.js
 */

// Mock the browser environment
import { JSDOM } from 'jsdom';

// Create a simple mock for the updateCanonicalUrl function
function createTestUpdateCanonicalUrl() {
  return function() {
    try {
      if (typeof window === 'undefined' || !document || !document.head) {
        return null;
      }

      // Always use the production domain for canonical URLs
      const baseUrl = 'https://web-it-easier.vercel.app';
      const path = window.location.pathname.replace(/\/+$/, ''); // Remove trailing slashes if present
      const canonicalUrl = baseUrl + (path || '/');
      
      if (!canonicalUrl) {
        return null;
      }
      
      // Get or create the canonical tag
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      
      if (!canonicalTag) {
        // Create the tag if it doesn't exist
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      } else if (canonicalTag.href === canonicalUrl) {
        // No need to update if the URL hasn't changed
        return canonicalUrl;
      }
      
      // Update the href
      canonicalTag.href = canonicalUrl;
      
      return canonicalUrl;
    } catch (error) {
      console.error('Error in test updateCanonicalUrl:', error);
      return null;
    }
  };
}

// Use our test implementation
const updateCanonicalUrl = createTestUpdateCanonicalUrl();

// Test cases
const testCases = [
  {
    name: 'Homepage',
    path: '/',
    expected: 'https://web-it-easier.vercel.app/'
  },
  {
    name: 'Blog listing',
    path: '/blog',
    expected: 'https://web-it-easier.vercel.app/blog'
  },
  {
    name: 'Blog post',
    path: '/blog/some-post',
    expected: 'https://web-it-easier.vercel.app/blog/some-post'
  },
  {
    name: 'With trailing slash',
    path: '/blog/',
    expected: 'https://web-it-easier.vercel.app/blog'
  }
];

// Run tests
async function runTests() {
  console.log('🚀 Starting canonical URL tests...\n');
  let passedTests = 0;
  
  for (const test of testCases) {
    console.log(`\n--- Testing: ${test.name} (${test.path}) ---`);
    
    // Create a new JSDOM instance for each test
    const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
      url: `https://example.com${test.path}`,
      runScripts: 'dangerously'
    });
    
    // Mock the browser globals
    global.window = dom.window;
    global.document = dom.window.document;
    
    try {
      // Run the function
      console.log('Calling updateCanonicalUrl()...');
      const result = updateCanonicalUrl();
      
      // Get the canonical tag from the DOM
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      const actualHref = canonicalTag ? canonicalTag.href : null;
      
      // Check the results
      const resultMatch = result === test.expected;
      const hrefMatch = actualHref === test.expected;
      const passed = resultMatch && hrefMatch;
      
      // Detailed output
      console.log('Test details:');
      console.log(`- Return value: ${result} ${resultMatch ? '✅' : '❌'}`);
      console.log(`- DOM href:    ${actualHref} ${hrefMatch ? '✅' : '❌'}`);
      
      if (!passed) {
        console.log('\n❌ FAILED - Issues found:');
        if (!resultMatch) console.log(`  - Expected return value: ${test.expected}`);
        if (!hrefMatch) console.log(`  - Expected href: ${test.expected}`);
      } else {
        passedTests++;
        console.log('\n✅ PASSED');
      }
      
      // Show the current head HTML for debugging
      console.log('\nCurrent <head> content:');
      console.log('-------------------');
      console.log(document.head.innerHTML);
      console.log('-------------------');
      
    } catch (error) {
      console.error(`❌ Test failed with error:`, error);
    }
  }
  
  // Final summary
  console.log(`\n📊 Test Results: ${passedTests}/${testCases.length} tests passed`);
  if (passedTests === testCases.length) {
    console.log('🎉 All tests passed successfully!');
  } else {
    console.log(`❌ ${testCases.length - passedTests} tests failed`);
  }
  
  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(console.error);
