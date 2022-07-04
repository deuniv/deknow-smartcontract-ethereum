all:
	npx hardhat compile
	cp -Rf artifacts deknow-admin-app/src/
	sol-merger --remove-comments contracts/DeKnow.sol
	mv contracts/DeKnow_merged.sol release
	npx hardhat run scripts/deploy-counter-script.js --network localhost

clean:
	rm -f contracts/DeKnow_merged.sol