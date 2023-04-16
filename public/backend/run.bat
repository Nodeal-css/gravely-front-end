@echo off

if "%1" == "pocketbase" pocketbase serve

if "%1" == "minio" minio server s3 --console-address ":9001"