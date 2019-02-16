BEGIN;

-- Creating the tables
CREATE TABLE xyuser (
    username      VARCHAR(21)          PRIMARY KEY,
    password      VARCHAR(40) NOT NULL,              -- HEX SHA1 of the password
    registered_on TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE xysession (
    token      VARCHAR(64)          PRIMARY KEY,
    created_on TIMESTAMP   NOT NULL DEFAULT NOW(),
    removed_on TIMESTAMP,
    xyuser     VARCHAR(21) NOT NULL,
    
    CONSTRAINT fk_xysession_xyuser
        FOREIGN KEY (xyuser)
        REFERENCES xyuser (username)
);

CREATE TABLE poi (
    coord_x    INTEGER      NOT NULL,
    coord_y    INTEGER      NOT NULL,
    name       VARCHAR(128) NOT NULL,
    created_on TIMESTAMP    NOT NULL DEFAULT NOW(),
    added_by   VARCHAR(21)  NOT NULL,

    CONSTRAINT pk_poi
        PRIMARY KEY (coord_x, coord_y),

    CONSTRAINT fk_poi_xyuser
        FOREIGN KEY (added_by)
        REFERENCES xyuser (username)
);
CREATE INDEX idx_poi_x ON poi USING BTREE (coord_x);
CREATE INDEX idx_poi_y ON poi USING BTREE (coord_y);

-- Adding admin
INSERT INTO xyuser (username, password)
     VALUES ('admin', 'd033e22ae348aeb5660fc2140aec35850c4da997'); -- admin admin

COMMIT;
