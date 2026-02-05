-- ========================================
-- Update Category Icons to Emojis
-- ========================================
USE nutritrack;

UPDATE categories SET icon = '🍖' WHERE id = 1;
UPDATE categories SET icon = '🍚' WHERE id = 2;
UPDATE categories SET icon = '🍲' WHERE id = 3;
UPDATE categories SET icon = '🍳' WHERE id = 4;
UPDATE categories SET icon = '🥗' WHERE id = 5;
UPDATE categories SET icon = '🍎' WHERE id = 6;
UPDATE categories SET icon = '🍰' WHERE id = 7;
UPDATE categories SET icon = '🥤' WHERE id = 8;

SELECT id, name, icon FROM categories;
