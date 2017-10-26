-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'SessionInfo'
-- 
-- ---
 
DROP TABLE IF EXISTS SessionInfo cascade;
DROP SEQUENCE IF EXISTS SessionInfo_seq;
CREATE SEQUENCE SessionInfo_seq;

CREATE TABLE SessionInfo (
  id INTEGER NOT NULL DEFAULT NEXTVAL ('SessionInfo_seq'),
  user_id INTEGER,
  session_id INTEGER,
  requestType VARCHAR(50),
  majorPair VARCHAR(6),
  indicator VARCHAR(50),
  interval VARCHAR(50),
  requestTime timestamp,
  PRIMARY KEY (id)
);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `SessionInfo` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---
