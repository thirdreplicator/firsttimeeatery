#!/usr/bin/env bash
rm  -rf /var/www/firsttimeeatery/dist/client/images && \
	ln -s /var/www/ft-public/images/ /var/www/firsttimeeatery/dist/client/images
