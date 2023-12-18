app.use(addLogger)
app.get('/loggerTest', (req, res) => {
	//dev
	req.logger.debug('Prueba de Desarrollo')

	//prod 
	req.logger.info('Prueba en producción de consola')
	req.logger.error('Fallo prueba en producción de archivo')
	req.logger.warning('Fallo prueba en producción de archivo')

	res.send({ message: 'Prueba de logger, Correcta!' })
})
