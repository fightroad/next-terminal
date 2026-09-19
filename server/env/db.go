package env

import (
	"fmt"
	"time"

	"next-terminal/server/config"
	"next-terminal/server/model"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func setupDB() *gorm.DB {

	var logMode logger.Interface
	if config.GlobalCfg.Debug {
		logMode = logger.Default.LogMode(logger.Info)
	} else {
		logMode = logger.Default.LogMode(logger.Silent)
	}

	fmt.Printf("当前数据库模式为：%v\n", config.GlobalCfg.DB)
	var err error
	var db *gorm.DB
	if config.GlobalCfg.DB == "mysql" {
		dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local&timeout=60s",
			config.GlobalCfg.Mysql.Username,
			config.GlobalCfg.Mysql.Password,
			config.GlobalCfg.Mysql.Hostname,
			config.GlobalCfg.Mysql.Port,
			config.GlobalCfg.Mysql.Database,
		)
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logMode,
		})
	} else {
		dsn := fmt.Sprintf("file:%s?cache=shared&mode=rwc&_pragma=busy_timeout(5000)", config.GlobalCfg.Sqlite.File)
		db, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
			Logger:                 logMode,
			SkipDefaultTransaction: true,
		})
	}

	if err != nil {
		panic(fmt.Errorf("连接数据库异常: %v", err.Error()))
	}

	sqlDB, err := db.DB()
	if err != nil {
		panic(fmt.Errorf("获取数据库连接异常: %v", err.Error()))
	}

	if config.GlobalCfg.DB == "mysql" {
		sqlDB.SetMaxOpenConns(25)
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetConnMaxLifetime(time.Hour)
	} else {
		// SQLite 写并发弱，单连接 + WAL 更稳
		sqlDB.SetMaxOpenConns(1)
		sqlDB.SetMaxIdleConns(1)
		sqlDB.SetConnMaxLifetime(time.Hour)
		if err := db.Exec("PRAGMA journal_mode=WAL").Error; err != nil {
			panic(fmt.Errorf("设置 SQLite WAL 失败: %v", err.Error()))
		}
		if err := db.Exec("PRAGMA busy_timeout=5000").Error; err != nil {
			panic(fmt.Errorf("设置 SQLite busy_timeout 失败: %v", err.Error()))
		}
		if err := db.Exec("PRAGMA foreign_keys=ON").Error; err != nil {
			panic(fmt.Errorf("设置 SQLite foreign_keys 失败: %v", err.Error()))
		}
	}

	if err := db.AutoMigrate(&model.User{}, &model.Asset{}, &model.AssetAttribute{}, &model.Session{}, &model.Command{},
		&model.Credential{}, &model.Property{}, &model.UserGroup{}, &model.UserGroupMember{},
		&model.LoginLog{}, &model.Job{}, &model.JobLog{}, &model.AccessSecurity{}, &model.AccessGateway{},
		&model.Storage{}, &model.Strategy{},
		&model.AccessToken{}, &model.ShareSession{},
		&model.Role{}, &model.RoleMenuRef{}, &model.UserRoleRef{},
		&model.LoginPolicy{}, &model.LoginPolicyUserRef{}, &model.TimePeriod{},
		&model.StorageLog{}, &model.Authorised{}); err != nil {
		panic(fmt.Errorf("初始化数据库表结构异常: %v", err.Error()))
	}
	return db
}
