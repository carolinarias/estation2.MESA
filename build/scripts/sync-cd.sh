#!/bin/bash
# this script is 
# - updating the cd repository with
# the files in the packages repository

. ./config

#update repository package inxed
#./update-repository.sh

rsync -av $GITDIR/build/CD_IMAGE/ $CD_BUILD_DIR/
