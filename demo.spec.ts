import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Accessibility audit and ARIA validation', async ({ page }) => {
  test.setTimeout(60000); // extend timeout for slow pages

  // 1. Go to the URL 
  await page.goto('https://www.w3schools.com/accessibility', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // 2. Inject axe-core and run analysis
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // 3. Print ALL violations
  console.log('All Accessibility Violations:');
  accessibilityScanResults.violations.forEach((v) => {
    console.log(`- ID: ${v.id}`);
    console.log(`  Description: ${v.description}`);
    console.log(`  Impact: ${v.impact}`);
  });

  // 4. Print SERIOUS or CRITICAL only
  const seriousViolations = accessibilityScanResults.violations.filter((v) =>
    v.impact === 'serious' || v.impact === 'critical'
  );

  console.log('Serious or Critical Violations:');
  seriousViolations.forEach((v) => {
    console.log(`- ID: ${v.id}`);
    console.log(`  Description: ${v.description}`);
    console.log(`  Impact: ${v.impact}`);
  });

  // 5. Get ARIA Snapshot
  const ariaSnapshot = await page.accessibility.snapshot();
  console.log(' ARIA Snapshot:', JSON.stringify(ariaSnapshot, null, 2));

  // 6. Validate "Learning by Reading" heading
  const heading = await page.getByRole('heading', { name: 'Learning by Reading', level: 2 });
  await expect(heading).toBeVisible();
});
